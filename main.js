(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── language ───────────────────────────────────────────────────────── */
  var EN = new Map();
  var nodes = document.querySelectorAll('[data-i18n],[data-i18n-html]');
  nodes.forEach(function (el) {
    var html = el.hasAttribute('data-i18n-html');
    EN.set(el, html ? el.innerHTML : el.textContent);
  });

  function setLang(lang) {
    var dict = (window.I18N || {})[lang] || null;
    nodes.forEach(function (el) {
      var html = el.hasAttribute('data-i18n-html');
      var key = el.getAttribute(html ? 'data-i18n-html' : 'data-i18n');
      var val = dict && dict[key];
      if (html) el.innerHTML = val || EN.get(el);
      else el.textContent = val || EN.get(el);
    });
    document.documentElement.lang = lang;
    document.querySelectorAll('.langs button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
    try { localStorage.setItem('mk-lang', lang); } catch (e) {}
  }

  document.querySelectorAll('.langs button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.lang); });
  });

  var saved = null;
  try { saved = localStorage.getItem('mk-lang'); } catch (e) {}
  if (!saved) {
    var nav = (navigator.language || 'en').slice(0, 2);
    saved = ['en', 'uk', 'ru', 'es'].indexOf(nav) > -1 ? nav : 'en';
  }
  if (saved !== 'en') setLang(saved);

  /* ── reveal on scroll + count-up ────────────────────────────────────── */
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  items.forEach(function (el, i) {
    var d = (i % 6) * 60;
    el.style.transitionDelay = d + 'ms, ' + d + 'ms';
  });

  function countUp(node) {
    if (node.dataset.counted) return;
    node.dataset.counted = '1';
    var target = parseInt(node.getAttribute('data-count'), 10);
    var fmt = function (n) {
      return target > 999 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009') : String(n);
    };
    if (reduce) { node.textContent = fmt(target); return; }
    var t0 = performance.now(), dur = 1400;
    (function step(now) {
      var p = Math.min(1, (now - t0) / dur);
      node.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        e.target.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
    document.querySelectorAll('[data-count]').forEach(countUp);
  }

  /* ── card tilt ──────────────────────────────────────────────────────── */
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.tilt').forEach(function (host) {
      var card = host.querySelector('.shot');
      if (!card) return;
      host.addEventListener('mousemove', function (e) {
        var r = host.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'rotateY(' + (x * 9).toFixed(2) + 'deg) rotateX(' +
          (-y * 9).toFixed(2) + 'deg) translateZ(14px) scale(1.012)';
      });
      host.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  /* ── 3D hero ────────────────────────────────────────────────────────── */
  var canvas = document.getElementById('scene');
  var hero = document.getElementById('hero');
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.scenes [data-variant]'));

  function hasWebGL() {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext &&
        (c.getContext('webgl2') || c.getContext('webgl')));
    } catch (e) { return false; }
  }

  if (!canvas || !hero || !hasWebGL()) {
    if (canvas) canvas.remove();
    document.querySelector('.scenes') && document.querySelector('.scenes').remove();
    return;
  }

  import('./scene.js').then(function (mod) {
    var scene = mod.initScene(canvas, hero, {
      variant: 'solid',
      motion: reduce ? 0 : 1,
      still: reduce
    });
    if (reduce) {
      document.querySelector('.scenes') && document.querySelector('.scenes').remove();
      return;
    }
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        scene.setVariant(b.dataset.variant);
        buttons.forEach(function (o) {
          o.setAttribute('aria-pressed', String(o === b));
        });
      });
    });
  }).catch(function (err) {
    console.warn('3D scene unavailable:', err);
    canvas.remove();
    document.querySelector('.scenes') && document.querySelector('.scenes').remove();
  });
})();
