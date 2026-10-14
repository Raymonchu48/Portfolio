/* Separate ES/EN pages and section-preserving navigation, as in Deportivo. */
(() => {
  const isPortfolio = !!document.querySelector('.rail');
  document.querySelectorAll('.language-switch a').forEach(link => {
    link.addEventListener('click', () => {
      const section = document.querySelector('main > .view-active');
      const url = new URL(link.getAttribute('href'), location.href);
      url.hash = section ? section.id : location.hash;
      if (document.getElementById('terminalOverlay')?.classList.contains('open')) url.searchParams.set('terminal', '1');
      if (document.body.classList.contains('hud-off')) url.searchParams.set('hud', 'off');
      link.href = url.href;
    });
  });
  if (!isPortfolio) return;
  const restoreSection = () => {
    const id = location.hash.slice(1);
    const trigger = [...document.querySelectorAll('.rail-item[data-target]')].find(button => button.dataset.target === id);
    trigger?.click();
  };
  restoreSection();
  addEventListener('hashchange', restoreSection);
  const params = new URLSearchParams(location.search);
  if (params.get('hud') === 'off') document.querySelector('[data-action="hud"]')?.click();
  if (params.get('terminal') === '1') document.querySelector('.mode-switcher [data-action="terminal"]')?.click();
})();
