(function () {
  'use strict';
  var d = document, w = window;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };

  /* ── Tarjetas de miembros (16) ── */
  var wall = $('#wall');
  if (wall) {
    var html = '';
    for (var i = 1; i <= 16; i++) {
      var n = (i < 10 ? '0' : '') + i;
      html += '<li class="m" data-reveal data-delay="' + ((i - 1) % 6) + '">' +
              '<span class="m__ph"><img src="img/card-' + n + '.webp" alt="Miembro Élite ' + n + '" width="480" height="640"></span>' +
              '<span class="m__plate"><img src="img/plate-gold.webp" alt="" aria-hidden="true"><b>Miembro Elite <i>' + n + '°</i></b></span></li>';
    }
    wall.innerHTML = html;
  }

  /* ── Iconos de la sección Experiencia ── */
  var icons = {
    chat:  '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/>',
    live:  '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
    class: '<path d="M3 7l9-4 9 4-9 4-9-4Z"/><path d="M7 9.5V15c0 1.4 2.2 3 5 3s5-1.6 5-3V9.5"/>',
    file:  '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    shield:'<path d="M12 3 4 6v6c0 4.5 3.2 7.8 8 9 4.8-1.2 8-4.5 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>'
  };
  $$('.bento__icon').forEach(function (el) {
    el.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + (icons[el.getAttribute('data-i')] || '') + '</svg>';
  });

  /* ── Secuencia de carga del hero ── */
  function start() { d.body.classList.remove('is-loading'); }
  if (d.readyState === 'complete') { requestAnimationFrame(start); }
  else { w.addEventListener('load', function () { requestAnimationFrame(start); }); setTimeout(start, 1800); }

  /* ── Reveal escalonado ── */
  var items = $$('[data-reveal]');
  items.forEach(function (el) { el.style.setProperty('--d', el.getAttribute('data-delay') || 0); });
  if ('IntersectionObserver' in w) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('is-in'); }); }

  /* ── Scroll: nav, progreso, parallax y CTA flotante ── */
  var nav = $('#nav'), bar = $('#progress'), sticky = $('#stickyCta');
  var docA = $('.hero__doc--a'), docB = $('.hero__doc--b'), ring = $('.hero__ring');
  var hero = $('.hero'), memb = $('#membresia');
  var ticking = false;

  function frame() {
    var y = w.pageYOffset, h = d.documentElement.scrollHeight - w.innerHeight;
    nav.classList.toggle('is-stuck', y > 24);
    bar.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    var hh = hero.offsetHeight;
    if (sticky) {
      var mTop = memb.getBoundingClientRect().top, mBot = memb.getBoundingClientRect().bottom;
      var show = y > hh * 0.8 && !(mTop < w.innerHeight * 0.7 && mBot > 0);
      sticky.classList.toggle('is-on', show);
    }
    ticking = false;
  }
  w.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  w.addEventListener('resize', frame);
  frame();

  /* ── Enlace activo en la navegación ── */
  var links = $$('.nav__links a');
  if ('IntersectionObserver' in w) {
    var map = {};
    links.forEach(function (a) { var s = $(a.getAttribute('href')); if (s) map[s.id] = a; });
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) {
          links.forEach(function (l) { l.classList.remove('is-active'); });
          map[e.target.id].classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { so.observe($('#' + id)); });
  }

  /* ── Hero: leve respuesta al cursor (solo con mouse) ── */
  if (w.matchMedia('(hover:hover) and (pointer:fine)').matches && ring) {
    hero.addEventListener('mousemove', function (e) {
      var x = (e.clientX / w.innerWidth - 0.5), y = (e.clientY / w.innerHeight - 0.5);
      ring.style.marginLeft = (x * -26) + 'px';
      ring.style.marginTop = (y * -18) + 'px';
    });
  }

  /* ── Vídeo del hero: se pausa fuera de pantalla ── */
  var v = $('.hero__video');
  if (v && 'IntersectionObserver' in w) {
    new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else { v.pause(); } });
    }, { threshold: 0.05 }).observe(v);
  }
})();
