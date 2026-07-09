# CSE 21B Feedback System

A full-stack feedback collection app for CSE 21st Batch, Section B (Level 1, Term 2). Students submit anonymous, one-time feedback about two CRs; the CRs get a protected dashboard with filtering and PDF export.

## Stack
- **Frontend:** React (Vite), Tailwind CSS + DaisyUI (custom "campus" theme), Redux Toolkit, React Router, Framer Motion, React Hot Toast, React Loading Skeleton
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, PDFKit

## Project structure
```
feedback-app/
  backend/
    config/db.js
    models/         Feedback.js, Settings.js, Admin.js
    middleware/      auth.js, duplicateGuard.js, rateLimiter.js, errorHandler.js
    controllers/     feedbackController.js, adminController.js
    routes/          feedbackRoutes.js, adminRoutes.js
    utils/pdfGenerator.js
    server.js
    seedAdmin.js
  frontend/
    src/
      pages/          Home, FeedbackForm, ThankYou, AdminLogin, AdminDashboard
      components/     StarRating, ProtectedRoute
      redux/          store + feedbackSlice + adminSlice
      api/axios.js
      utils/deviceFingerprint.js
```

## Local setup

### 1. Backend
```bash
cd backend
cp .env.example .env     # fill in MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
node seedAdmin.js        # creates the admin account from .env
npm run dev              # http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```
The Vite dev server proxies `/api` to `http://localhost:5000`, so no CORS setup is needed locally.

## How the one-submission rule works
Three independent signals are combined server-side, checked in this order:

1. **An httpOnly cookie** (`fb_submitted`) set right after a successful submission. Page JS can't read or clear it, and it survives a wiped localStorage — the strongest of the three.
2. **A device fingerprint** from [FingerprintJS](https://github.com/fingerprintjs/fingerprintjs) (open-source build), derived from canvas rendering, WebGL renderer strings, audio-context output, and installed fonts. Unlike a stored token, this is *recomputed* from hardware/browser characteristics each visit, so clearing site data alone doesn't reset it.
3. **A salted hash of the requester's IP** (raw IP is never stored) — catches a second attempt from the same network even on a fresh browser profile.

If any of the three matches an existing record, the submission is rejected with a 409. This is meaningfully stronger than a plain localStorage flag, but it's still not identity verification — someone using a different device on a different network with cookies blocked can get through. Closing that gap fully would mean requiring a verified identity (e.g. a one-time code sent to a university email), which trades away the "no login" requirement — happy to add that as an opt-in mode if you want it.

## Admin flow
- Login at `/admin/login` with the credentials seeded via `seedAdmin.js`.
- JWT is stored both as an httpOnly cookie and in `localStorage` (for cross-origin deployments like Render + Vercel).
- Dashboard tabs: **Overview** (stats, rating-trend line chart filterable by CR and time range, PDF export), **Feedback** (filterable list + pagination), **Settings** (CR names, welcome message, thank-you messages).

## Deployment notes (Render)
- Deploy `backend/` as a Web Service. Set env vars from `.env.example` in the Render dashboard.
- Deploy `frontend/` as a Static Site (`npm run build`, publish `dist/`), and set `CLIENT_URL` on the backend to the deployed frontend URL.
- Update `VITE`-side API base URL if you don't want to rely on the dev proxy — the simplest approach is to reverse-proxy `/api` on the same domain, or set `withCredentials` + full backend URL in `src/api/axios.js` for cross-domain cookies.

## Security notes
- Passwords hashed with bcrypt (12 rounds).
- `express-mongo-sanitize` + `xss-clean` on all input.
- Rate limiting on `/api` generally, stricter limiting on submission + login endpoints.
- Both frontend and backend validate required fields (rating 1–5, feedback required, 3000-char caps).
