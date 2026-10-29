// The mocks' only script: the scrolled top bar, bottom-chrome tracking for
// phones whose browser chrome sits at the bottom, and nothing else. Behaviour
// belongs to the Angular app; this file exists so the static pages look right.
(() => {
  const root = document.documentElement;
  const topbar = document.querySelector('.topbar');
  const onScroll = () => topbar && topbar.classList.toggle('topbar--scrolled', window.scrollY > 4);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const vv = window.visualViewport;
  const update = () => {
    const bottom = vv ? Math.max(0, root.clientHeight - (vv.offsetTop + vv.height)) : 0;
    root.style.setProperty('--sl-chrome-bottom', `${bottom}px`);
  };
  if (vv) {
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
  }
  window.addEventListener('resize', update);
  update();
})();
