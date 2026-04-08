/* ============================================
   RISEUP SECURITY — DASHBOARD JS
   ============================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const user = window.RiseUpAuth?.getUser();
  if (!user) return;

  // Greet user by time of day
  const hour   = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const greetEl  = document.getElementById('dash-greeting');
  if (greetEl) greetEl.textContent = `${greeting}, ${(user.name || 'there').split(' ')[0]}.`;

  // Simulate loading stats with a short delay
  setTimeout(() => {
    animateDashStat('stat-active',  3);
    animateDashStat('stat-alerts',  2);
    animateDashStat('stat-reports', 7);
    animateDashStat('stat-days',   28);
  }, 400);
});

function animateDashStat(id, target) {
  const el = document.getElementById(id);
  if (!el) return;

  let current = 0;
  const step = () => {
    current++;
    el.textContent = current;
    if (current < target) setTimeout(step, 80);
  };
  step();
}
