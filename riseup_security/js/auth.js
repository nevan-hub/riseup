/* ============================================
   RISEUP SECURITY — AUTH JS
   Frontend auth logic (JWT via backend)
   ============================================ */
'use strict';

const API = '/api'; // Backend base URL

/* ── Helpers ── */
function setError(msg) {
  const el = document.getElementById('auth-error');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
}

function clearError() {
  const el = document.getElementById('auth-error');
  if (el) el.style.display = 'none';
}

function setLoading(btn, loading) {
  if (!btn) return;
  btn.disabled = loading;
  btn.innerHTML = loading
    ? '<div class="spinner"></div>'
    : btn.dataset.label || 'Submit';
}

function saveToken(token) {
  localStorage.setItem('rs_token', token);
}

function getToken() {
  return localStorage.getItem('rs_token');
}

function clearToken() {
  localStorage.removeItem('rs_token');
  localStorage.removeItem('rs_user');
}

function saveUser(user) {
  localStorage.setItem('rs_user', JSON.stringify(user));
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('rs_user'));
  } catch {
    return null;
  }
}

function redirectToDashboard() {
  const base = window.location.pathname.includes('/pages/') ? '' : 'pages/';
  window.location.href = `${base}dashboard.html`;
}

function redirectToLogin() {
  const base = window.location.pathname.includes('/pages/') ? '' : 'pages/';
  window.location.href = `${base}login.html`;
}

/* ── Guard: protect dashboard ── */
function guardDashboard() {
  if (window.location.pathname.includes('dashboard')) {
    const token = getToken();
    if (!token) redirectToLogin();
  }
}

/* ── Login ── */
async function handleLogin(e) {
  e.preventDefault();
  clearError();

  const email    = document.getElementById('login-email')?.value.trim();
  const password = document.getElementById('login-password')?.value;
  const btn      = document.getElementById('login-btn');

  if (!email || !password) { setError('Please enter your email and password.'); return; }

  setLoading(btn, true);

  try {
    const res  = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Login failed.');

    saveToken(data.token);
    saveUser(data.user);
    redirectToDashboard();

  } catch (err) {
    setError(err.message);
    setLoading(btn, false);
  }
}

/* ── Register ── */
async function handleRegister(e) {
  e.preventDefault();
  clearError();

  const name     = document.getElementById('reg-name')?.value.trim();
  const email    = document.getElementById('reg-email')?.value.trim();
  const password = document.getElementById('reg-password')?.value;
  const confirm  = document.getElementById('reg-confirm')?.value;
  const btn      = document.getElementById('reg-btn');

  if (!name || !email || !password) { setError('All fields are required.'); return; }
  if (password !== confirm)          { setError('Passwords do not match.'); return; }
  if (password.length < 8)           { setError('Password must be at least 8 characters.'); return; }

  setLoading(btn, true);

  try {
    const res  = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Registration failed.');

    saveToken(data.token);
    saveUser(data.user);
    redirectToDashboard();

  } catch (err) {
    setError(err.message);
    setLoading(btn, false);
  }
}

/* ── Logout ── */
function handleLogout() {
  clearToken();
  redirectToLogin();
}

/* ── Auth-gated API calls ── */
async function authFetch(url, options = {}) {
  const token = getToken();
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  guardDashboard();

  const loginForm = document.getElementById('login-form');
  const regForm   = document.getElementById('register-form');
  const logoutBtn = document.getElementById('logout-btn');

  if (loginForm) loginForm.addEventListener('submit', handleLogin);
  if (regForm)   regForm.addEventListener('submit', handleRegister);
  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

  // Populate dashboard user info
  const user = getUser();
  if (user) {
    document.querySelectorAll('[data-user-name]').forEach(el => {
      el.textContent = user.name || 'Client';
    });
    document.querySelectorAll('[data-user-email]').forEach(el => {
      el.textContent = user.email || '';
    });
    document.querySelectorAll('[data-user-initial]').forEach(el => {
      el.textContent = (user.name || 'C')[0].toUpperCase();
    });
  }
});

// Export for use in dashboard.js
window.RiseUpAuth = { getToken, getUser, authFetch, handleLogout };
