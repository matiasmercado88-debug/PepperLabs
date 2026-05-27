(function () {
  'use strict';

  var groups = {};
  document.querySelectorAll('[data-lightbox]').forEach(function (el) {
    var g = el.dataset.lightbox;
    if (!groups[g]) groups[g] = [];
    var imgEl = el.querySelector('img');
    groups[g].push({
      el: el,
      img: el.dataset.img || (imgEl ? imgEl.getAttribute('src') : ''),
      caption: el.dataset.caption || '',
      href: el.tagName === 'A' ? el.getAttribute('href') : (el.dataset.href || '')
    });
  });
  if (!Object.keys(groups).length) return;

  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-hidden', 'true');
  lb.innerHTML =
    '<div class="lightbox-bg" data-lb-close></div>' +
    '<button class="lightbox-arrow prev" type="button" aria-label="Anterior">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' +
    '</button>' +
    '<button class="lightbox-arrow next" type="button" aria-label="Siguiente">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>' +
    '</button>' +
    '<button class="lightbox-close" type="button" data-lb-close aria-label="Cerrar">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>' +
    '</button>' +
    '<div class="lightbox-stage" role="document">' +
      '<img class="lightbox-img" alt="">' +
      '<div class="lightbox-bar">' +
        '<span class="lightbox-caption"></span>' +
        '<span class="lightbox-counter"></span>' +
        '<a class="lightbox-link" target="_blank" rel="noopener">Abrir original <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M7 17 17 7M9 7h8v8"/></svg></a>' +
      '</div>' +
    '</div>';
  document.body.appendChild(lb);

  var img = lb.querySelector('.lightbox-img');
  var caption = lb.querySelector('.lightbox-caption');
  var counter = lb.querySelector('.lightbox-counter');
  var link = lb.querySelector('.lightbox-link');
  var prevBtn = lb.querySelector('.lightbox-arrow.prev');
  var nextBtn = lb.querySelector('.lightbox-arrow.next');

  var current = { group: null, idx: 0 };

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function show(group, idx) {
    var items = groups[group];
    if (!items || !items[idx]) return;
    current.group = group;
    current.idx = idx;
    var item = items[idx];
    img.src = item.img;
    img.alt = item.caption || '';
    caption.textContent = item.caption || '';
    counter.textContent = pad(idx + 1) + ' / ' + pad(items.length);
    if (item.href && !item.href.startsWith('#')) {
      link.href = item.href;
      link.style.display = '';
    } else {
      link.removeAttribute('href');
      link.style.display = 'none';
    }
    var multi = items.length > 1;
    prevBtn.style.display = multi ? '' : 'none';
    nextBtn.style.display = multi ? '' : 'none';
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    img.removeAttribute('src');
  }

  function navigate(delta) {
    if (!current.group) return;
    var items = groups[current.group];
    var n = (current.idx + delta + items.length) % items.length;
    show(current.group, n);
  }

  Object.keys(groups).forEach(function (g) {
    groups[g].forEach(function (item, idx) {
      item.el.addEventListener('click', function (e) {
        e.preventDefault();
        show(g, idx);
      });
    });
  });

  lb.addEventListener('click', function (e) {
    var t = e.target;
    while (t && t !== lb) {
      if (t.hasAttribute && t.hasAttribute('data-lb-close')) { close(); return; }
      t = t.parentNode;
    }
  });
  prevBtn.addEventListener('click', function () { navigate(-1); });
  nextBtn.addEventListener('click', function () { navigate(1); });

  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') navigate(-1);
    else if (e.key === 'ArrowRight') navigate(1);
  });

  var touchX = null;
  lb.addEventListener('touchstart', function (e) {
    touchX = e.changedTouches[0].screenX;
  }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].screenX - touchX;
    if (Math.abs(dx) > 40) navigate(dx > 0 ? -1 : 1);
    touchX = null;
  });
})();
