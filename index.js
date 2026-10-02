'use strict';

const root = document.documentElement;
root.classList.add('js-ready');
const themeButton = document.querySelector('.theme-toggle');
const themeColor = document.querySelector('meta[name="theme-color"]');

function updateThemeButton() {
  const isDark = root.dataset.theme === 'dark';
  const label = `Switch to ${isDark ? 'light' : 'dark'} theme`;
  themeButton.setAttribute('aria-label', label);
  themeButton.title = label;
  themeColor.content = isDark ? '#111210' : '#f7f7ef';
}

themeButton.hidden = false;
updateThemeButton();
themeButton.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch {}
  updateThemeButton();
  window.dispatchEvent(new Event('portfolio-theme-change'));
});

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
menuButton.hidden = false;
function setMenuOpen(open) {
  navigation.classList.toggle('is-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', `${open ? 'Close' : 'Open'} navigation`);
}
menuButton.addEventListener('click', () => setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenuOpen(false);
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header')) setMenuOpen(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    setMenuOpen(false);
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 601px)').addEventListener('change', () => setMenuOpen(false));

const projectFilters = document.querySelector('.project-filters');
const projectGrid = document.querySelector('.projects-grid');
const projectCards = [...document.querySelectorAll('.project-card')];
const filterStatus = document.querySelector('#filter-status');
projectFilters.hidden = false;
projectFilters.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-filter]');
  if (!button) return;
  const filter = button.dataset.filter;
  for (const item of projectFilters.querySelectorAll('button')) {
    item.setAttribute('aria-pressed', String(item === button));
  }
  projectGrid.classList.toggle('is-filtered', filter !== 'all');
  let count = 0;
  for (const card of projectCards) {
    card.hidden = filter !== 'all' && card.dataset.category !== filter;
    if (!card.hidden) count += 1;
  }
  filterStatus.textContent = `${count} ${count === 1 ? 'project' : 'projects'} shown.`;
});

const navLinks = [...navigation.querySelectorAll('a')];
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of navLinks) {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }
  }, { rootMargin: '-15% 0px -60% 0px' });
  document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));
}
document.querySelector('#copyright-year').textContent = new Date().getFullYear();

// Content and navigation work independently of this decorative enhancement.
import('./assets/sculpture.js').then(({ initSculpture }) => initSculpture()).catch(() => {
  // The SVG illustration remains if WebGL or module loading is unavailable.
});
