// Header shadow on scroll and the footer year. No framework, no build.
(() => {
  const header = document.querySelector('.header');
  const onScroll = () => header && header.classList.toggle('header--scrolled', window.scrollY > 4);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  for (const el of document.querySelectorAll('[data-year]'))
    el.textContent = String(new Date().getFullYear());
})();
