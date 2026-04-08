/* ============================================
   RISEUP SECURITY — CALCULATOR
   Interactive cost estimator
   ============================================ */
'use strict';

const RATES = {
  physical: {
    unarmed: { hourly: 95,  label: 'Unarmed Guard' },
    armed:   { hourly: 145, label: 'Armed Guard' },
    vip:     { hourly: 220, label: 'VIP / Executive Protection' },
    patrol:  { daily:  680, label: 'Mobile Patrol' },
    event:   { daily:  120, label: 'Event Security (per guard/day)' },
  },
  cyber: {
    monitoring: { monthly: 3500, label: '24/7 Threat Monitoring' },
    audit:      { once: 8500,    label: 'Security Audit (once-off)' },
    firewall:   { monthly: 1800, label: 'Firewall Management' },
    pentest:    { once: 12000,   label: 'Penetration Testing' },
    incident:   { once: 5000,    label: 'Incident Response Planning' },
  }
};

function formatCurrency(n) {
  return 'R ' + Math.round(n).toLocaleString('en-ZA');
}

function calculate() {
  const type     = document.getElementById('calc-type')?.value;
  const subtype  = document.getElementById('calc-subtype')?.value;
  const qty      = parseInt(document.getElementById('calc-qty')?.value || 1);
  const duration = parseInt(document.getElementById('calc-duration')?.value || 1);
  const unit     = document.getElementById('calc-unit')?.value || 'hours';

  let estimate = 0;
  let breakdown = '';

  if (type === 'physical') {
    const rate = RATES.physical[subtype];
    if (!rate) return;

    if (rate.hourly) {
      const hours = unit === 'days' ? duration * 12 : duration;
      estimate  = rate.hourly * qty * hours;
      breakdown = `${qty} × ${rate.label} × ${hours} hrs @ R${rate.hourly}/hr`;
    } else if (rate.daily) {
      estimate  = rate.daily * qty * duration;
      breakdown = `${qty} × ${rate.label} × ${duration} days @ R${rate.daily}/day`;
    }
  } else if (type === 'cyber') {
    const rate = RATES.cyber[subtype];
    if (!rate) return;

    if (rate.monthly) {
      estimate  = rate.monthly * duration;
      breakdown = `${rate.label} × ${duration} month(s) @ R${rate.monthly}/mo`;
    } else if (rate.once) {
      estimate  = rate.once;
      breakdown = `${rate.label} — once-off engagement`;
    }
  }

  const resultEl    = document.getElementById('calc-result');
  const totalEl     = document.getElementById('calc-total');
  const breakdownEl = document.getElementById('calc-breakdown');

  if (resultEl) resultEl.classList.add('visible');
  if (totalEl)  totalEl.textContent  = formatCurrency(estimate);
  if (breakdownEl) breakdownEl.textContent = breakdown;
}

function updateSubtype() {
  const type    = document.getElementById('calc-type')?.value;
  const subSel  = document.getElementById('calc-subtype');
  const unitRow = document.getElementById('calc-unit-row');
  if (!subSel) return;

  subSel.innerHTML = '';

  const options = type === 'physical'
    ? Object.entries(RATES.physical).map(([k, v]) => `<option value="${k}">${v.label}</option>`)
    : Object.entries(RATES.cyber).map(([k, v]) => `<option value="${k}">${v.label}</option>`);

  subSel.innerHTML = options.join('');

  // Show/hide unit selector for physical
  if (unitRow) unitRow.style.display = type === 'physical' ? '' : 'none';

  // Update duration label
  updateDurationLabel();
}

function updateDurationLabel() {
  const type    = document.getElementById('calc-type')?.value;
  const subtype = document.getElementById('calc-subtype')?.value;
  const label   = document.getElementById('calc-duration-label');
  if (!label) return;

  if (type === 'cyber') {
    const rate = RATES.cyber[subtype];
    label.textContent = rate?.monthly ? 'Months' : 'Engagement (fixed)';
  } else {
    label.textContent = 'Duration';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const typeEl    = document.getElementById('calc-type');
  const subtypeEl = document.getElementById('calc-subtype');
  const calcBtn   = document.getElementById('calc-btn');

  if (typeEl)    typeEl.addEventListener('change', updateSubtype);
  if (subtypeEl) subtypeEl.addEventListener('change', updateDurationLabel);
  if (calcBtn)   calcBtn.addEventListener('click', calculate);

  // Init
  if (typeEl) updateSubtype();
});
