#!/usr/bin/env node
/**
 * generate-pdf.js — собирает resume.pdf как точную копию живого сайта.
 *
 * Опыт, зашитый в скрипт (см. PROJECT_GUIDE.md → «Как обновить resume.pdf»):
 *  - рендер через системный Chrome (puppeteer-core, Chromium не качается);
 *  - emulateMediaType('screen') — копия сайта, а не урезанная @media print;
 *  - prefers-reduced-motion: reduce — reveal-контент виден без прокрутки;
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

const ROOT = path.join(__dirname, '..');
const SRC_FILE = path.join(ROOT, 'index.html');
const OUT_FILE = path.join(ROOT, 'resume.pdf');
const SRC_URL = 'file:///' + SRC_FILE.replace(/\\/g, '/');
const WIDTH = 1200;

const args = process.argv.slice(2);
const WATCH = args.includes('--watch');
const IF_STALE = args.includes('--if-stale');

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
  try {
    return require('puppeteer-core');
  } catch (_) {
    return null;
  }
}

function isStale() {
  try {
    const src = fs.statSync(SRC_FILE).mtimeMs;
    const out = fs.statSync(OUT_FILE).mtimeMs;
    return src > out;
  } catch (_) {
    return true; // нет PDF — считаем устаревшим
  }
}

async function render(puppeteer, chrome) {
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

    await page.goto(SRC_URL, { waitUntil: 'load', timeout: 60000 });

    // Дождаться шрифтов и всех изображений (с защитным таймаутом).
    await page.evaluate(async () => {
      const cap = ms => new Promise(r => setTimeout(r, ms));
      const fonts = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
      const imgs = Array.from(document.images).map(img =>
        img.complete && img.naturalWidth ? Promise.resolve()
          : new Promise(res => { img.onload = img.onerror = res; }));
      await Promise.race([Promise.all([fonts, ...imgs]), cap(15000)]);
    });

    // Подстраховка: принудительно показать reveal-состояния, убрать служебные оверлеи.
    await page.addStyleTag({ content: `
      *, *::before, *::after { animation: none !important; transition: none !important; }
      .reveal, .line-inner, .hero-tag, .hero-sub, .hero-cta, .hero-meta > div,
      .project, .project .project-visual, .project .project-content, .section-head {
        opacity: 1 !important; transform: none !important; clip-path: none !important;
      }
      .scroll-progress, .proj-cursor, .lang-menu { display: none !important; }
    `});

    await new Promise(r => setTimeout(r, 400));

    const height = await page.evaluate(() => Math.ceil(
      Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
    ));

    await page.pdf({
      path: OUT_FILE,
      printBackground: true,
      width: WIDTH + 'px',
      height: (height + 2) + 'px',
      pageRanges: '1',
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
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

  if (!puppeteer) {
    console.error('[pdf] puppeteer-core не установлен. Выполните: npm install (в папке resume)');
    process.exit(2);
  }
  if (!chrome) {
    console.error('[pdf] Chrome/Edge не найден. Установите Chrome или задайте CHROME_PATH.');
    process.exit(2);
  }

  if (WATCH) {
    console.log('[pdf] watch-режим: слежу за index.html. Ctrl+C для выхода.');
    let timer = null, busy = false;
    const trigger = () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        if (busy) return;
        busy = true;
        try { await render(puppeteer, chrome); }
        catch (e) { console.error('[pdf] ошибка:', e.message); }
        finally { busy = false; }
      }, 500);
    };
    await render(puppeteer, chrome); // первичная сборка
    fs.watch(SRC_FILE, { persistent: true }, trigger);
    return; // держим процесс
  }

  if (IF_STALE && !isStale()) {
    console.log('[pdf] resume.pdf актуален — пропускаю.');
    return;
  }

  await render(puppeteer, chrome);
}

main().catch(e => { console.error('[pdf] FAIL', e); process.exit(1); });
