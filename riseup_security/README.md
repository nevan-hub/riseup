# RiseUp Security — Website

Premium liquid glass security company website. Physical & cybersecurity, dual-division, full-stack.

---

## Folder Structure

```
riseup-security/
├── index.html                  # Homepage
├── pages/
│   ├── services.html
│   ├── about.html
│   ├── pricing.html
│   ├── contact.html
│   ├── consultation.html
│   ├── dashboard.html
│   ├── login.html
│   └── register.html
├── components/
│   ├── navbar.html             # Shared across all pages
│   └── footer.html
├── css/
│   ├── style.css               # Core design system
│   ├── glass.css               # Glassmorphism utilities
│   └── animations.css          # All animations
├── js/
│   ├── components.js           # Navbar/footer loader
│   ├── main.js                 # Scroll reveal, particles, chat
│   ├── animations.js           # Tilt, parallax, typewriter
│   ├── calculator.js           # Cost estimator (ZAR)
│   ├── auth.js                 # Frontend auth/JWT
│   └── dashboard.js            # Dashboard stats
├── backend/
│   ├── server.js               # Express entry point
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── services.js
│   │   └── reports.js
│   ├── controllers/
│   │   └── authController.js
│   ├── models/
│   │   ├── User.js
│   │   └── Service.js
│   └── config/
│       ├── authMiddleware.js
│       └── seed.js
├── .env.example
├── .gitignore
└── package.json
```

---

## Frontend Only (no backend)

Open `index.html` directly in a browser — no setup needed. The component loader uses `fetch()`, so you'll need a local server for components to load correctly:

```bash
# Using Python
python3 -m http.server 3000

# Using Node
npx serve .

# Then visit: http://localhost:3000
```

The **Demo Account** button on the login page bypasses the backend entirely so the dashboard can be explored without a running server.

---

## Full Stack Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start MongoDB
```bash
# Make sure MongoDB is running locally, or use MongoDB Atlas
mongod
```

### 4. Seed demo data (optional)
```bash
npm run seed
# Creates: demo@riseupsecurity.co.za / demo1234
```

### 5. Run the server
```bash
npm run dev   # development (with nodemon)
npm start     # production
```

### 6. Visit
```
http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint                  | Auth     | Description              |
|--------|---------------------------|----------|--------------------------|
| POST   | /api/auth/register        | Public   | Create account           |
| POST   | /api/auth/login           | Public   | Sign in, get JWT         |
| GET    | /api/auth/me              | Bearer   | Get current user         |
| GET    | /api/users/me             | Bearer   | Full profile             |
| PATCH  | /api/users/me             | Bearer   | Update profile           |
| PATCH  | /api/users/me/password    | Bearer   | Change password          |
| GET    | /api/services             | Bearer   | My active services       |
| GET    | /api/services/:id         | Bearer   | Single service           |
| GET    | /api/reports              | Bearer   | My reports list          |
| GET    | /api/health               | Public   | Server health check      |

---

## Design System

| Token           | Value               |
|-----------------|---------------------|
| `--bg-primary`  | `#05070D`           |
| `--bg-secondary`| `#0B1220`           |
| `--gold`        | `#D4AF37`           |
| `--text-primary`| `#E5E7EB`           |
| Font Display    | Cinzel (serif)      |
| Font Body       | DM Sans             |

---

## Demo Login
- **Email:** demo@riseupsecurity.co.za
- **Password:** demo1234
- Use the **"Use Demo Account"** button on the login page to skip backend auth.

---

*RiseUp Security © 2026 — Rising to protect what matters most.*
