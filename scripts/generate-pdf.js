#!/usr/bin/env node
/**
 * generate-pdf.js — собирает resume.pdf как точную копию живого сайта.
 *
 * Опыт, зашитый в скрипт (см. PROJECT_GUIDE.md → «Как обновить resume.pdf»):
 *  - рендер через системный Chrome (puppeteer-core, Chromium не качается);
 *  - страница отдаётся по HTTP с локального статик-сервера, а НЕ через file://:
 *    под file:// каждый ресурс — отдельный opaque-origin, и внешний styles.css
 *    не применяется (страница выходит без стилей). HTTP это чинит;
 *  - emulateMediaType('screen') — копия сайта, а не урезанная @media print;
 *  - prefers-reduced-motion: reduce — reveal-контент виден без прокрутки,
 *    three.js-сцена не грузится, показывается статичный hero-фолбэк;
 *  - принудительно грузим картинки eager (loading="lazy" в headless ненадёжен);
 *  - ждём document.fonts.ready и загрузку всех картинок (с таймаутом);
 *  - одна длинная страница = весь сайт целиком, с фоном (printBackground).
 *
 * Запуск:
 *   node scripts/generate-pdf.js            # собрать один раз
 *   node scripts/generate-pdf.js --watch    # пересобирать при изменении index.html
 *   node scripts/generate-pdf.js --if-stale # собрать только если index.html новее resume.pdf
 *
 * Коды выхода: 0 — успех; 1 — ошибка рендера; 2 — нет окружения (Chrome/puppeteer-core).
 */
'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.join(__dirname, '..');
const SRC_FILE = path.join(ROOT, 'index.html');
const OUT_FILE = path.join(ROOT, 'resume.pdf');
const WIDTH = 1200;

const args = process.argv.slice(2);
const WATCH = args.includes('--watch');
const IF_STALE = args.includes('--if-stale');

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.gif': 'image/gif', '.ico': 'image/x-icon', '.pdf': 'application/pdf',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let rel = decodeURIComponent(req.url.split('?')[0]);
      if (rel === '/' || rel === '') rel = '/index.html';
      const file = path.join(ROOT, path.normalize(rel).replace(/^(\.\.[\/\\])+/, ''));
      if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
      fs.readFile(file, (err, data) => {
        if (err) { res.writeHead(404); res.end('not found'); return; }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

function findChrome() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google\\Chrome\\Application\\chrome.exe'),
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean);
  return candidates.find(p => { try { return fs.existsSync(p); } catch (_) { return false; } });
}

function loadPuppeteer() {
  try { return require('puppeteer-core'); } catch (_) { return null; }
}

function isStale() {
  try {
    return fs.statSync(SRC_FILE).mtimeMs > fs.statSync(OUT_FILE).mtimeMs;
  } catch (_) { return true; }
}

async function render(puppeteer, chrome, baseUrl) {
  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: true,
    args: ['--no-sandbox', '--force-color-profile=srgb', '--hide-scrollbars'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: 1600, deviceScaleFactor: 2 });
    await page.emulateMediaType('screen');
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

    await page.goto(baseUrl + '/index.html', { waitUntil: 'load', timeout: 60000 });

    // loading="lazy" в headless-снимке длинной страницы не подхватывается —
    // принудительно грузим все картинки eager перед снимком.
    await page.evaluate(async () => {
      const cap = ms => new Promise(r => setTimeout(r, ms));
      const imgs = Array.from(document.images);
      imgs.forEach(i => { i.loading = 'eager'; });
      await Promise.all(imgs.map(i => {
        if (i.complete && i.naturalWidth) return Promise.resolve();
        return new Promise(res => {
          i.addEventListener('load', res, { once: true });
          i.addEventListener('error', res, { once: true });
          const s = i.src; i.src = ''; i.src = s;
          setTimeout(res, 8000);
        });
      }));
      await cap(80);
    });

    // Дождаться шрифтов.
    await page.evaluate(async () => {
      const cap = ms => new Promise(r => setTimeout(r, ms));
      const fonts = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
      await Promise.race([fonts, cap(8000)]);
    });

    // Подстраховка: показать reveal-состояния, убрать служебные оверлеи.
    await page.addStyleTag({ content: `
      *, *::before, *::after { animation: none !important; transition: none !important; }
      .reveal, .hero-tag, .hero-title, .hero-sub, .hero-cta, .hero-meta,
      .project, .section-head, .exp-item, .edu-item, .about-lead, .contact-grid {
        opacity: 1 !important; transform: none !important; clip-path: none !important;
      }
      .scroll-progress { display: none !important; }
    `});

    await new Promise(r => setTimeout(r, 400));

    const height = await page.evaluate(() => Math.ceil(
      Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
    ));

    await page.pdf({
      path: OUT_FILE, printBackground: true,
      width: WIDTH + 'px', height: (height + 2) + 'px',
      pageRanges: '1', margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    const kb = Math.round(fs.statSync(OUT_FILE).size / 1024);
    console.log(`[pdf] ok — ${path.basename(OUT_FILE)} (${kb} KB, ${height}px)`);
  } finally {
    await browser.close();
  }
}

async function main() {
  const puppeteer = loadPuppeteer();
  const chrome = findChrome();

  if (!puppeteer) { console.error('[pdf] puppeteer-core не установлен. Выполните: npm install (в папке resume)'); process.exit(2); }
  if (!chrome) { console.error('[pdf] Chrome/Edge не найден. Установите Chrome или задайте CHROME_PATH.'); process.exit(2); }

  if (IF_STALE && !isStale() && !WATCH) { console.log('[pdf] resume.pdf актуален — пропускаю.'); return; }

  const server = await startServer();
  const baseUrl = 'http://127.0.0.1:' + server.address().port;

  try {
    if (WATCH) {
      console.log('[pdf] watch-режим: слежу за index.html. Ctrl+C для выхода.');
      let timer = null, busy = false;
      const trigger = () => {
        clearTimeout(timer);
        timer = setTimeout(async () => {
          if (busy) return; busy = true;
          try { await render(puppeteer, chrome, baseUrl); }
          catch (e) { console.error('[pdf] ошибка:', e.message); }
          finally { busy = false; }
        }, 500);
      };
      await render(puppeteer, chrome, baseUrl);
      fs.watch(SRC_FILE, { persistent: true }, trigger);
      return; // держим процесс + сервер
    }

    await render(puppeteer, chrome, baseUrl);
  } finally {
    if (!WATCH) server.close();
  }
}

main().catch(e => { console.error('[pdf] FAIL', e); process.exit(1); });
