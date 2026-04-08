/* ============================================
   RISEUP SECURITY — MAIN JS
   ============================================ */
'use strict';

/* ── Scroll Reveal ── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ── Stats Counter Animation ── */
function animateCounter(el, target, duration = 1500) {
  const start = 0;
  const step  = (timestamp) => {
    if (!step.start) step.start = timestamp;
    const progress = Math.min((timestamp - step.start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * ease) + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const statEls = document.querySelectorAll('.stat-number[data-target]');
  if (!statEls.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el  = entry.target;
        const val = parseInt(el.dataset.target);
        animateCounter(el, val);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statEls.forEach(el => observer.observe(el));
}

/* ── Particle Canvas (hero) ── */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx  = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H;
      this.size = Math.random() * 1.5 + 0.3;
      this.vx   = (Math.random() - 0.5) * 0.25;
      this.vy   = (Math.random() - 0.5) * 0.25;
      this.life = Math.random();
      this.maxLife = Math.random() * 0.6 + 0.3;
    }
    update() {
      this.x    += this.vx;
      this.y    += this.vy;
      this.life += 0.002;
      if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.6;
      ctx.globalAlpha = alpha;
      ctx.fillStyle   = '#00E676';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 80 }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }

  init();
  loop();
  window.addEventListener('resize', resize);
}

/* ── Parallax ── */
function initParallax() {
  const orbs = document.querySelectorAll('.parallax-slow, .parallax-medium');
  if (!orbs.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    orbs.forEach(el => {
      const speed = el.classList.contains('parallax-slow') ? 0.08 : 0.15;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });
}

/* ── Button Ripple ── */
function initRipple() {
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect   = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top  = `${e.clientY - rect.top}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });
}

/* ── Live Chat Widget ── */
function initChat() {
  const fab   = document.getElementById('chat-fab');
  const panel = document.getElementById('chat-panel');
  const close = document.getElementById('chat-close');
  const input = document.getElementById('chat-input');
  const send  = document.getElementById('chat-send');
  const msgs  = document.getElementById('chat-messages');

  if (!fab || !panel) return;

  const botReplies = [
    "Thanks for reaching out! A security consultant will be with you shortly.",
    "Great question. RiseUp Security offers both physical and cyber protection. Would you like more details on a specific service?",
    "Absolutely — we can arrange a free consultation at your convenience. Want me to help you book one?",
    "Our team operates 24/7. You can also call us directly or submit a quote request online.",
    "I'll flag this for our team. Expect a call within 1 business hour during working hours.",
  ];

  let botIndex = 0;

  fab.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) input.focus();
  });

  if (close) close.addEventListener('click', () => panel.classList.remove('open'));

  function addMessage(text, type) {
    const div = document.createElement('div');
    div.className = `chat-msg ${type}`;
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    input.value = '';
    setTimeout(() => {
      addMessage(botReplies[botIndex % botReplies.length], 'bot');
      botIndex++;
    }, 800);
  }

  if (send)  send.addEventListener('click', sendMessage);
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
}

/* ── Page Init ── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initCounters();
  initParticles();
  initParallax();
  initRipple();
  initChat();
  document.body.classList.add('page-enter');
});
