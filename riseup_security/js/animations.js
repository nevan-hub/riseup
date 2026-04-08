/* ============================================
   RISEUP SECURITY — ANIMATIONS JS
   Additional scroll + parallax effects
   ============================================ */
'use strict';

/* ── Smooth Parallax on hero orbs ── */
(function initOrbParallax() {
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  const orb3 = document.querySelector('.orb-3');

  if (!orb1 && !orb2 && !orb3) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (orb1) orb1.style.transform = `translateY(${y * 0.12}px)`;
      if (orb2) orb2.style.transform = `translateY(${y * -0.08}px)`;
      if (orb3) orb3.style.transform = `translateY(${y * 0.18}px)`;
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
})();

/* ── Mouse-tracking subtle card tilt ── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.service-card-hero, .glass-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left - rect.width  / 2;
      const y      = e.clientY - rect.top  - rect.height / 2;
      const rotX   =  (y / rect.height) * 4;
      const rotY   = -(x / rect.width)  * 4;

      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
})();

/* ── Stagger grid children on reveal ── */
(function initStaggerReveal() {
  const grids = document.querySelectorAll('.stagger');
  if (!grids.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const children = entry.target.children;
      Array.from(children).forEach((child, i) => {
        child.style.transitionDelay = `${i * 0.07}s`;
        child.classList.add('reveal');
        setTimeout(() => child.classList.add('visible'), 10);
      });
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  grids.forEach(g => obs.observe(g));
})();

/* ── Typing effect for hero headline ── */
(function initTyping() {
  const el = document.getElementById('hero-typed');
  if (!el) return;

  const phrases = ['Physical Security', 'Cyber Protection', 'Integrated Defense'];
  let pIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const phrase = phrases[pIdx];

    if (!deleting) {
      el.textContent = phrase.slice(0, ++cIdx);
      if (cIdx === phrase.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
      }
    }

    setTimeout(type, deleting ? 40 : 80);
  }

  setTimeout(type, 1000);
})();
