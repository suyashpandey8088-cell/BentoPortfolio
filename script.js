// ---------- Element refs ----------
const cursor = document.querySelector('.cursor');
const projects = document.querySelector('.project-track');
const work = document.querySelector('.work');
const heroTitle = document.querySelector('.hero h1');
const heroOrbit = document.querySelector('.hero-orbit');
const heroGrid = document.querySelector('.hero-grid');
const nav = document.querySelector('nav');
const progressBar = document.querySelector('.scroll-progress i');
const projectArticles = document.querySelectorAll('.project');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Custom cursor ----------
window.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});
document.querySelectorAll('a,.skill-card,.project-art').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('active'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});

// ---------- Core scroll-driven motion ----------
function scrollMotion() {
  const y = window.scrollY;
  const vh = innerHeight;
  const docHeight = document.documentElement.scrollHeight - vh;

  // Overall scroll progress bar
  if (progressBar && docHeight > 0) {
    progressBar.style.width = `${Math.min(1, Math.max(0, y / docHeight)) * 100}%`;
  }

  // Hero title scale/fade as you leave the hero
  const p = Math.min(1, Math.max(0, y / (vh * .9)));
  if (heroTitle) {
    heroTitle.style.transform = `scale(${1 - p * .42}) translateX(${p * 8}%)`;
    heroTitle.style.opacity = 1 - p * .45;
  }

  // Subtle parallax on hero decorations
  if (heroOrbit) heroOrbit.style.transform = `translateY(${p * 60}px) rotate(${p * 25}deg)`;
  if (heroGrid && innerWidth > 800) heroGrid.style.transform = `rotate(3deg) translateY(${p * -40}px)`;

  // Nav background on scroll
  if (y > 40) {
    nav.style.background = 'rgba(8,9,9,.72)';
    nav.style.backdropFilter = 'blur(16px)';
    nav.style.padding = '18px 4vw';
  } else {
    nav.style.background = 'transparent';
    nav.style.backdropFilter = 'none';
    nav.style.padding = '30px 4vw';
  }

  // Horizontal scroll-jacked project track + per-card focus state
  if (innerWidth > 800 && projects) {
    const rect = work.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, -rect.top / (work.offsetHeight - vh)));
    const distance = projects.scrollWidth - innerWidth * .92;
    projects.style.transform = `translateX(${-progress * distance}px)`;

    if (projectArticles.length) {
      const center = innerWidth / 2;
      let closest = null;
      let closestDist = Infinity;
      projectArticles.forEach(article => {
        const artRect = article.getBoundingClientRect();
        const artCenter = artRect.left + artRect.width / 2;
        const dist = Math.abs(artCenter - center);
        if (dist < closestDist) { closestDist = dist; closest = article; }
      });
      projectArticles.forEach(article => article.classList.toggle('is-focused', article === closest));
    }
  }

  document.body.classList.toggle('scrolled-top', y <= 10);
}
window.addEventListener('scroll', scrollMotion, { passive: true });
window.addEventListener('resize', scrollMotion);
scrollMotion();

// ---------- Rail section indicator ----------
const railObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const section = entry.target.dataset.section;
      if (section) {
        document.querySelectorAll('.rail span').forEach(s => {
          s.style.opacity = s.textContent.includes(section) ? 1 : .35;
        });
      }
    }
  });
}, { threshold: .25 });
document.querySelectorAll('section[data-section]').forEach(s => railObserver.observe(s));

// ---------- Scroll-triggered reveal animations ----------
const revealTargets = document.querySelectorAll(
  '.about-grid > *, .skill-card, .time-card, .contact-card, .section-head'
);
revealTargets.forEach(el => el.classList.add('reveal'));

if (prefersReducedMotion) {
  revealTargets.forEach(el => el.classList.add('in-view'));
} else {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${Math.min(i, 5) * 60}ms`;
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .15, rootMargin: '0px 0px -8% 0px' });
  revealTargets.forEach(el => revealObserver.observe(el));
}

// ---------- Back-to-top button ----------
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > innerHeight * 1.2);
  }, { passive: true });
  backToTop.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}
