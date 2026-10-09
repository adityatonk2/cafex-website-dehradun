(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';
  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Menu data (from the printed CAFEX menu) ---------- */
  var MENU = [
    { id: 'hot', name: 'Hot Coffee', img: 'assets/coffee-cups-pic.jpg', alt: 'Latte art in a CAFEX cup',
      note: 'Flavoured coffee: hazelnut, tiramisu, vanilla or caramel.',
      items: [['Cappuccino',99,119],['Café Latte',109,119],['Flat White',109,119],['Café Mocha',129,149],['Flavoured Coffee',149,169],['Submarine (white chocolate)',159,179],['Espresso (black)',79,99],['Americano (black)',89,109],['Hot Chocolate (non-coffee)',159,179]] },
    { id: 'cold', name: 'Cold Brew & Iced Espresso', img: 'assets/unnamed-4.jpg', alt: 'Iced coffee with marshmallow topping',
      note: 'Flavoured frappe: hazelnut, tiramisu, vanilla or caramel.',
      items: [['Cafe Frappe',149,179],['Flavoured Frappe',179,199],['Iced Latte',149,169],['Iced Americano',149,169],['Iced Machiato',159,179],['Iced Mocha',159,179],['Vanilla Cream Ice',169,189],['Salted Caramel Mocha',169,189],['Vietnamese Coffee',169,189]] },
    { id: 'shakes', name: 'Shakes', img: 'assets/unnamed-1.jpg', alt: 'CAFEX chocolate shake with cream',
      items: [['Chocolate',139,169],['Mango',139,169],['Red Velvet',139,169],['Mix Fruit',139,169],['Blue Berry',139,169],['Salted Caramel',139,169],['Strawberry Banana',139,169],['Tiramisu',139,179],['Oreo Chocolate',149,179],['Nutty Kitkat',149,179],['Vanilla Oreo',159,189],['Choco Hazelnut',159,189],['Peanut Butter',159,189]] },
    { id: 'mojito', name: 'Mojitos & Coolers', img: 'assets/unnamed-8.jpg', alt: 'The CAFEX truck at the end of the day',
      items: [['Classic Mojito',109,139],['Kiwi Cooler',109,139],['Blue Lagoon',109,139],['Green Apple Cinnamon',109,139],['Forest Fruit',109,139],['Orange Juice',109,139],['Blueberry',109,139],['Pineapple',109,139],['Rainbow Mocktail',139,159]] },
    { id: 'food', name: 'Food & Desserts', img: 'assets/food.jpg', alt: 'Pancakes with strawberries, honey and cream',
      note: 'Food prices are not on the printed drinks menu. Ask at the counter.',
      items: [['Pancakes'],['Cakes'],['Cupcakes'],['Cheese Chilli Toast'],['Vada Pav'],['Honey Chilli Potato']] }
  ];

  var tabs = document.getElementById('tabs');
  var list = document.getElementById('menuList');
  var img = document.getElementById('menuImg');
  var current = 'hot';

  MENU.forEach(function (c) {
    var b = document.createElement('button');
    b.type = 'button'; b.role = 'tab'; b.textContent = c.name; b.dataset.id = c.id;
    b.setAttribute('aria-selected', c.id === current);
    b.addEventListener('click', function () { show(c.id, true); });
    tabs.appendChild(b);
  });

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  function render(c) {
    var priced = c.items[0].length > 1;
    var html = priced ? '<div class="menu-head"><span>' + esc(c.name) + '</span><span>Medium</span><span>Large</span></div>' : '';
    c.items.forEach(function (it) {
      html += '<div class="row"><span>' + esc(it[0]) + '</span>' +
        (priced ? '<b>₹' + it[1] + '</b><b>₹' + it[2] + '</b>' : '<b></b><b></b>') + '</div>';
    });
    if (c.note) html += '<p class="fine">' + esc(c.note) + '</p>';
    list.innerHTML = html;
    img.src = c.img; img.alt = c.alt;
  }

  function show(id, animate) {
    if (id === current && animate) return;
    current = id;
    Array.prototype.forEach.call(tabs.children, function (b) { b.setAttribute('aria-selected', b.dataset.id === id); });
    var c = MENU.filter(function (m) { return m.id === id; })[0];
    if (hasGsap && animate && !reduce) {
      gsap.to(list, { opacity: 0, y: 10, duration: .18, onComplete: function () {
        render(c);
        gsap.fromTo(list, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .4, ease: 'power2.out' });
        gsap.from('.row', { opacity: 0, x: -10, stagger: .03, duration: .35 });
      } });
    } else render(c);
  }
  show('hot', false);
  document.querySelectorAll('[data-cat]').forEach(function (a) { a.addEventListener('click', function () { show(a.dataset.cat, true); }); });

  /* ---------- Gallery + lightbox ---------- */
  var PHOTOS = [
    ['assets/foodtruck.jpg', 'The CAFEX coffee truck among trees'],
    ['assets/unnamed-4.jpg', 'Iced coffee topped with marshmallow'],
    ['assets/unnamed-7.jpg', 'Outdoor seating under umbrellas'],
    ['assets/food.jpg', 'Pancakes with strawberries and honey'],
    ['assets/coffe.jpg', 'Espresso machine and grinder at the counter'],
    ['assets/unnamed-9.jpg', 'Chocolate pancakes with chocolate sauce'],
    ['assets/unnamed-8.jpg', 'The CAFEX truck with string lights'],
    ['assets/unnamed-1.jpg', 'CAFEX chocolate shake'],
    ['assets/unnamed-10.jpg', 'Inside the CAFEX truck'],
    ['assets/unnamed-6.jpg', 'Pancakes beside a CAFEX coffee cup'],
    ['assets/coffee-cups-pic.jpg', 'Latte art and a sprinkle cupcake'],
    ['assets/unnamed-11.jpg', 'The CAFEX sign']
  ];
  var mas = document.getElementById('masonry');
  PHOTOS.forEach(function (p, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.setAttribute('aria-label', 'Enlarge photo: ' + p[1]);
    b.innerHTML = '<img src="' + p[0] + '" alt="' + p[1] + '" loading="lazy">';
    b.addEventListener('click', function () { open(i); });
    mas.appendChild(b);
  });
  var lb = document.getElementById('lb'), lbImg = document.getElementById('lbImg'), idx = 0;
  function set(i) { idx = (i + PHOTOS.length) % PHOTOS.length; lbImg.src = PHOTOS[idx][0]; lbImg.alt = PHOTOS[idx][1]; }
  function open(i) { set(i); if (lb.showModal) lb.showModal(); else lb.setAttribute('open', ''); }
  function close() { if (lb.close) lb.close(); else lb.removeAttribute('open'); }
  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', function () { set(idx - 1); });
  document.getElementById('lbNext').addEventListener('click', function () { set(idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  lb.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') set(idx - 1);
    if (e.key === 'ArrowRight') set(idx + 1);
  });
  var tx = 0;
  lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    var d = e.changedTouches[0].clientX - tx;
    if (Math.abs(d) > 50) set(idx + (d < 0 ? 1 : -1));
  });

  /* ---------- Reviews carousel ---------- */
  var track = document.getElementById('reviews-track');
  function slide(dir) { track.scrollBy({ left: dir * (track.firstElementChild.offsetWidth + 24), behavior: reduce ? 'auto' : 'smooth' }); }
  document.getElementById('prev').addEventListener('click', function () { slide(-1); });
  document.getElementById('next').addEventListener('click', function () { slide(1); });
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') slide(1);
    if (e.key === 'ArrowLeft') slide(-1);
  });

  /* ---------- Nav, back to top ---------- */
  var nav = document.getElementById('nav'), burger = document.getElementById('burger'),
      links = document.getElementById('links'), top = document.getElementById('totop');
  function toggle(open) {
    links.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { toggle(!links.classList.contains('open')); });
  links.addEventListener('click', function (e) { if (e.target.tagName === 'A') toggle(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggle(false); });
  function onScroll() {
    nav.classList.toggle('solid', window.scrollY > 60);
    top.classList.toggle('show', window.scrollY > 900);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* ---------- Motion (GSAP) ---------- */
  if (!hasGsap || reduce) return;

  // One orchestrated moment: hero headline lines rise, image settles.
  var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.ln span', { yPercent: 110, duration: 1, stagger: .12 })
    .from('.hero .label, .lede, .hero .cta, .rating', { opacity: 0, y: 16, duration: .7, stagger: .08 }, '-=.6')
    .from('.hero-cup', { opacity: 0, scale: .92, duration: 1.1 }, '-=.9')
    .from('.hcard', { opacity: 0, y: 30, duration: .7, stagger: .1 }, '-=.6')
    .from('.hero-bg img', { scale: 1.15, duration: 2.2 }, 0);

  if (!window.ScrollTrigger) return;

  // Subtle hero parallax
  gsap.to('.hero-bg img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-cup', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // Headline reveals
  gsap.utils.toArray('.rv').forEach(function (el) {
    gsap.from(el, { opacity: 0, y: 28, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  // Story images: clip-path mask reveal
  gsap.utils.toArray('.mask').forEach(function (el, i) {
    gsap.from(el, { clipPath: 'inset(0 0 100% 0)', duration: 1.2, delay: i * .15, ease: 'power3.inOut', scrollTrigger: { trigger: '.story', start: 'top 70%', once: true } });
  });

  // Gentle parallax on story images
  gsap.to('.s1', { yPercent: -6, ease: 'none', scrollTrigger: { trigger: '.story', scrub: true } });
  gsap.to('.s2', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.story', scrub: true } });
})();
