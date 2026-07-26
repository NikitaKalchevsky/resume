/* main.js — interactions + i18n for the resume. Plain JS, no build. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Always start at the top on reload.
  if (history.scrollRestoration) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  /* ── i18n ───────────────────────────────────────────────────────────────
     EN lives in the DOM; we snapshot it as the source, and only translate the
     other three. Values may contain HTML (bold, <br>, swash span). */
  var T = {
    uk: {
      'nav.about': 'Про мене', 'nav.work': 'Роботи', 'nav.stack': 'Стек', 'nav.exp': 'Шлях', 'nav.contact': 'Контакти',
      'hero.tag': 'Відкритий до проєктів', 'hero.kicker': 'Full-Stack розробник · AI-автоматизація',
      'hero.sub': 'Створюю full-stack сайти й вебзастосунки, від фронтенду до бекенду, та AI-автоматизацію за ними, на яких <b>працює</b> реальний бізнес. Найновіший проєкт, живий магазин ателье вишивки у Флориді; до нього флагман, двомовний український магазин. Сім запущених проєктів, нуль співзасновників.',
      'hero.cta1': 'Дивитись роботи →', 'hero.cta2': 'Зв’язатися',
      'scene.label': 'Сцена', 'scene.solid': 'Обʼєм', 'scene.wire': 'Каркас', 'scene.cloud': 'Частинки', 'scene.hint': 'тягни щоб обертати · скрол щоб крутити',
      'meta.projects': 'Веб-платформ', 'meta.products': 'Товарів у продажу', 'meta.records': 'Записів у БД', 'meta.bots': 'Ботів у проді', 'meta.years': 'Років у tech',
      'about.title': 'Про мене',
      'about.p1': 'Створюю full-stack сайти й вебзастосунки, від фронтенду до бекенду, та AI-автоматизацію за ними, на яких <b>працює</b> реальний бізнес. Мій флагман, живий магазин ручної вишивки у Флориді; також запустив двомовний український магазин, маркетплейс прошивок на 7 мов і продакшн Telegram-ботів на Claude API.',
      'about.p2': 'Сім запущених проєктів, нуль співзасновників. Проєктую, кодую, деплою і підтримую сам.',
      'svc.1t': 'Інтернет-магазини', 'svc.1d': 'Вітрини, кошики, оплата й власна адмінка.',
      'svc.2t': 'Вебзастосунки', 'svc.2d': 'Від фронта до бекенду: React/Next.js на реальному API та БД.',
      'svc.3t': 'Адмінки та дашборди', 'svc.3d': 'Замовлення, склад, контент і користувачі в одному місці.',
      'svc.4t': 'Telegram та AI-боти', 'svc.4d': 'Автоматизація, інтеграції та чат-асистенти на Claude.',
      'work.title': 'Вибрані роботи', 'tag.flagship': 'Флагман',
      'stack.title': 'Стек', 'stack.note': 'Serverless там, де це доречно, один дроплет там, де дешевше. Обираю стек, що працює й тримається, а не наймодніший.',
      'exp.title': 'Шлях', 'edu.title': 'Навчання', 'edu.langs': 'Мови',
      'lvl.native': 'Рідна', 'lvl.working': 'Робочий рівень · активно вдосконалюю',
      'cta.title': 'Потрібен бот, інтеграція<br>чи <span class="swash">ціла система</span>?',
      'cta.sub': 'Telegram-боти, інтеграції Claude API, пайплайни автоматизації, full-stack вебзастосунки. Доступний для разових проєктів і на постійній основі.',
      'cta.email': 'Написати →', 'cta.pdf': 'Завантажити PDF',
      'footer.built': 'Зроблено самостійно, без фреймворків', 'footer.speaks': 'Ця сторінка говорить 4 мовами'
    },
    ru: {
      'nav.about': 'Обо мне', 'nav.work': 'Работы', 'nav.stack': 'Стек', 'nav.exp': 'Путь', 'nav.contact': 'Контакты',
      'hero.tag': 'Открыт к проектам', 'hero.kicker': 'Full-Stack разработчик · AI-автоматизация',
      'hero.sub': 'Делаю full-stack сайты и веб-приложения, от фронтенда до бэкенда, и AI-автоматизацию за ними, на которых <b>работает</b> реальный бизнес. Новейший проект, живой магазин ателье вышивки во Флориде; до него флагман, двуязычный украинский магазин. Семь запущенных проектов, ноль сооснователей.',
      'hero.cta1': 'Смотреть работы →', 'hero.cta2': 'Связаться',
      'scene.label': 'Сцена', 'scene.solid': 'Объём', 'scene.wire': 'Каркас', 'scene.cloud': 'Частицы', 'scene.hint': 'тяни чтобы вращать · скролл чтобы крутить',
      'meta.projects': 'Веб-платформ', 'meta.products': 'Товаров в продаже', 'meta.records': 'Записей в БД', 'meta.bots': 'Ботов в проде', 'meta.years': 'Лет в tech',
      'about.title': 'Обо мне',
      'about.p1': 'Делаю full-stack сайты и веб-приложения, от фронтенда до бэкенда, и AI-автоматизацию за ними, на которых <b>работает</b> реальный бизнес. Мой флагман, живой магазин ручной вышивки во Флориде; также запустил двуязычный украинский магазин, маркетплейс прошивок на 7 языков и продакшн Telegram-ботов на Claude API.',
      'about.p2': 'Семь запущенных проектов, ноль сооснователей. Проектирую, кодирую, деплою и поддерживаю сам.',
      'svc.1t': 'Интернет-магазины', 'svc.1d': 'Витрины, корзины, оплата и своя админка.',
      'svc.2t': 'Веб-приложения', 'svc.2d': 'От фронта до бэкенда: React/Next.js на реальном API и БД.',
      'svc.3t': 'Админки и дашборды', 'svc.3d': 'Заказы, склад, контент и пользователи в одном месте.',
      'svc.4t': 'Telegram и AI-боты', 'svc.4d': 'Автоматизация, интеграции и чат-ассистенты на Claude.',
      'work.title': 'Избранные работы', 'tag.flagship': 'Флагман',
      'stack.title': 'Стек', 'stack.note': 'Serverless там, где уместно, один дроплет там, где дешевле. Выбираю стек, который работает и держится, а не самый модный.',
      'exp.title': 'Путь', 'edu.title': 'Обучение', 'edu.langs': 'Языки',
      'lvl.native': 'Родной', 'lvl.working': 'Рабочий уровень · активно улучшаю',
      'cta.title': 'Нужен бот, интеграция<br>или <span class="swash">целая система</span>?',
      'cta.sub': 'Telegram-боты, интеграции Claude API, пайплайны автоматизации, full-stack веб-приложения. Доступен для разовых проектов и на постоянной основе.',
      'cta.email': 'Написать →', 'cta.pdf': 'Скачать PDF',
      'footer.built': 'Сделано в одиночку, без фреймворков', 'footer.speaks': 'Эта страница говорит на 4 языках'
    },
    es: {
      'nav.about': 'Sobre mí', 'nav.work': 'Trabajos', 'nav.stack': 'Stack', 'nav.exp': 'Trayectoria', 'nav.contact': 'Contacto',
      'hero.tag': 'Disponible para proyectos', 'hero.kicker': 'Desarrollador Full-Stack · Automatización con IA',
      'hero.sub': 'Construyo sitios y apps web full-stack, del frontend al backend, y la automatización con IA detrás, sobre los que <b>funcionan</b> negocios reales. Mi proyecto más reciente, una tienda de bordado artesanal en Florida; antes, mi buque insignia, una tienda ucraniana bilingüe. Siete proyectos lanzados, cero cofundadores.',
      'hero.cta1': 'Ver el trabajo →', 'hero.cta2': 'Contactar',
      'scene.label': 'Escena', 'scene.solid': 'Volumen', 'scene.wire': 'Malla', 'scene.cloud': 'Partículas', 'scene.hint': 'arrastra para rotar · scroll para girar',
      'meta.projects': 'Plataformas web', 'meta.products': 'SKU en venta', 'meta.records': 'Registros en BD', 'meta.bots': 'Bots en producción', 'meta.years': 'Años en tech',
      'about.title': 'Sobre mí',
      'about.p1': 'Construyo sitios y apps web full-stack, del frontend al backend, y la automatización con IA detrás, sobre los que <b>funcionan</b> negocios reales. Mi buque insignia es una tienda de bordado artesanal en Florida; también lancé una tienda ucraniana bilingüe, un marketplace de firmware en 7 idiomas y bots de Telegram en producción con la API de Claude.',
      'about.p2': 'Siete proyectos lanzados, cero cofundadores. Lo diseño, lo programo, lo despliego y lo mantengo.',
      'svc.1t': 'Tiendas e-commerce', 'svc.1d': 'Escaparates, carritos, pagos y un panel propio.',
      'svc.2t': 'Aplicaciones web', 'svc.2d': 'Del front al back: una UI React/Next.js sobre API y base de datos reales.',
      'svc.3t': 'Paneles y dashboards', 'svc.3d': 'Pedidos, inventario, contenido y usuarios en un solo lugar.',
      'svc.4t': 'Bots de Telegram e IA', 'svc.4d': 'Automatización, integraciones y asistentes con Claude.',
      'work.title': 'Trabajos seleccionados', 'tag.flagship': 'Insignia',
      'stack.title': 'Stack', 'stack.note': 'Serverless donde tiene sentido, un solo droplet donde sale más barato. Elijo el stack que se lanza y se mantiene, no el más de moda.',
      'exp.title': 'Trayectoria', 'edu.title': 'Aprendizaje', 'edu.langs': 'Idiomas',
      'lvl.native': 'Nativo', 'lvl.working': 'Nivel profesional · mejorando activamente',
      'cta.title': '¿Necesitas un bot, una integración<br>o un <span class="swash">sistema completo</span>?',
      'cta.sub': 'Bots de Telegram, integraciones con la API de Claude, pipelines de automatización, apps web full-stack. Disponible para proyectos puntuales o continuos.',
      'cta.email': 'Escríbeme →', 'cta.pdf': 'Descargar PDF',
      'footer.built': 'Hecho en solitario, sin frameworks', 'footer.speaks': 'Esta página habla 4 idiomas'
    }
  };

  var i18nEls = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
  i18nEls.forEach(function (el) { el.setAttribute('data-en', el.innerHTML); });

  function applyLang(lang) {
    i18nEls.forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (lang === 'en' || !T[lang] || !T[lang][key]) { el.innerHTML = el.getAttribute('data-en'); }
      else { el.innerHTML = T[lang][key]; }
    });
    document.documentElement.lang = lang;
    Array.prototype.forEach.call(document.querySelectorAll('.lang-switch button'), function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
    try { localStorage.setItem('resume-lang', lang); } catch (e) {}
  }
  Array.prototype.forEach.call(document.querySelectorAll('.lang-switch button'), function (b) {
    b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang')); });
  });
  var saved = 'en';
  try { saved = localStorage.getItem('resume-lang') || 'en'; } catch (e) {}
  if (saved !== 'en') applyLang(saved);

  /* ── Scroll progress + nav active state ── */
  var bar = document.querySelector('.scroll-progress');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    if (bar) bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    var y = window.scrollY + window.innerHeight * 0.35, current = -1;
    for (var i = 0; i < sections.length; i++) { if (sections[i] && sections[i].offsetTop <= y) current = i; }
    navLinks.forEach(function (a, i) { a.classList.toggle('active', i === current); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Reveal on scroll (cascade) + count-up ── */
  function fmtNum(n, suffix) {
    return n.toLocaleString('en-US').replace(/,/g, ' ') + (suffix ? '<span class="suffix">' + suffix + '</span>' : '');
  }
  function runCounter(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduce) { el.innerHTML = fmtNum(target, suffix); return; }
    var dur = 1400, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3); // ease-out-cubic
      el.innerHTML = fmtNum(Math.round(target * e), suffix);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        var sibs = el.parentElement ? Array.prototype.slice.call(el.parentElement.children).filter(function (c) { return c.classList.contains('reveal'); }) : [el];
        var delay = Math.max(0, sibs.indexOf(el)) * 60;
        setTimeout(function () {
          el.classList.add('in');
          Array.prototype.forEach.call(el.querySelectorAll('[data-count]'), runCounter);
          if (el.hasAttribute('data-count')) runCounter(el);
        }, delay);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-count]'), runCounter);
  }

  /* ── Project card tilt ── */
  if (fine && !reduce) {
    Array.prototype.forEach.call(document.querySelectorAll('.project-visual'), function (wrap) {
      var tilt = wrap.querySelector('.tilt');
      if (!tilt) return;
      wrap.addEventListener('mousemove', function (e) {
        var r = wrap.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.transform = 'rotateY(' + (px * 9) + 'deg) rotateX(' + (-py * 9) + 'deg)';
      });
      wrap.addEventListener('mouseleave', function () { tilt.style.transform = ''; });
    });
  }
})();
