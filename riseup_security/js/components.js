/* ============================================
   RISEUP SECURITY — COMPONENT LOADER
   Dynamically injects navbar and footer
   ============================================ */

(function () {
  'use strict';

  // Resolve the base path regardless of whether the page is in root or /pages/
  function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/pages/')) return '../';
    return './';
  }

  const base = getBasePath();

  // Fetch and inject a component into a target element
  async function loadComponent(url, targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load: ${url}`);
      const html = await res.text();
      target.innerHTML = html;
    } catch (err) {
      console.warn('[RiseUp] Component load error:', err.message);
    }
  }

  // Resolve all relative hrefs in the injected HTML to correct base
  function resolveLinks(basePrefix) {
    const links = document.querySelectorAll('#navbar-wrapper a, #footer-wrapper a');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel')) return;

      if (href.startsWith('/')) {
        // Absolute from root — rewrite using base
        link.href = basePrefix + href.replace(/^\//, '');
      }
    });
  }

  // Mark the active nav link
  function setActiveLink() {
    const raw = window.location.pathname.split('/').pop().replace('.html', '') || 'home';
    const page = raw === 'index' ? 'home' : raw;
    document.querySelectorAll('[data-page]').forEach(el => {
      if (el.getAttribute('data-page') === page) el.classList.add('active');
    });
  }

  // Scroll-based nav styling
  function initNavScroll() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    const handler = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', handler, { passive: true });
  }

  // Mobile nav toggle
  function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const links  = document.getElementById('nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });

    // Close on link click
    links.addEventListener('click', e => {
      if (e.target.tagName === 'A') links.classList.remove('open');
    });
  }

  // Floating back-to-top button
  function initBackToTop() {
    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"></polyline></svg>';
    document.body.appendChild(btn);

    const onScroll = () => {
      btn.classList.toggle('visible', window.scrollY > 320);
    };

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      bar.style.width = `${pct}%`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Main init
  async function init() {
    await Promise.all([
      loadComponent(`${base}components/navbar.html`, 'navbar-wrapper'),
      loadComponent(`${base}components/footer.html`, 'footer-wrapper'),
    ]);

    resolveLinks(base);
    setActiveLink();
    initNavScroll();
    initMobileNav();
    initBackToTop();
    initScrollProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
