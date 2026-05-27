/* PepperLabs — shared chrome interactions (nav + mobile menu + smooth) */
(function () {
  /* === Nav · mobile menu === */
  var hamb = document.getElementById('navHamb');
  var menu = document.getElementById('mobileMenu');
  var closer = document.getElementById('menuClose');

  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('open', open);
    if (hamb) {
      hamb.classList.toggle('open', open);
      hamb.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (hamb) hamb.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  if (closer) closer.addEventListener('click', function () { setMenu(false); });
  document.querySelectorAll('.mobile-menu a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  /* === Mark active nav link based on current pathname === */
  var currentPath = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').toLowerCase();
    if (href && href === currentPath) a.classList.add('active');
  });

  /* === Fade-in on scroll === */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('.fadein').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.fadein').forEach(function (el) { el.classList.add('in'); });
  }

  /* === Smooth in-page links === */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var hash = a.getAttribute('href');
      if (hash.length < 2) return;
      var t = document.querySelector(hash);
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
})();
