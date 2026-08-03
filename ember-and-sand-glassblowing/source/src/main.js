import '@fontsource/fraunces/400.css';
import '@fontsource/fraunces/600.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/500.css';
import './styles.css';

document.documentElement.classList.add('js');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const root = document.documentElement;

function updateScrollHeat() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 0;
  root.style.setProperty('--scroll-progress', progress.toFixed(4));
}

updateScrollHeat();
window.addEventListener('scroll', updateScrollHeat, { passive: true });
window.addEventListener('resize', updateScrollHeat);

if (!prefersReducedMotion.matches) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
  );

  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}

const stations = Array.from(document.querySelectorAll('.station'));
const pipeGlow = document.querySelector('.pipe-glow');

if (stations.length && pipeGlow) {
  const stationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = stations.indexOf(entry.target);
        const activeProgress = stations.length > 1 ? index / (stations.length - 1) : 0;
        pipeGlow.style.setProperty('--rail-progress', activeProgress.toFixed(3));
        stations.forEach((station, stationIndex) => {
          station.classList.toggle('is-active', stationIndex === index);
          station.classList.toggle('is-passed', stationIndex < index);
        });
      });
    },
    { threshold: 0.52 },
  );

  stations.forEach((station) => stationObserver.observe(station));
}

document.querySelector('.inquiry-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  if (!button) return;
  button.textContent = 'Inquiry noted';
  form.setAttribute('aria-busy', 'false');
});
