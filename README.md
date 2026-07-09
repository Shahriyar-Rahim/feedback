# 📝 CSE 21B Feedback System

<div align="center">

![Header Banner](https://img.shields.io/badge/Full--Stack%20Feedback%20App-blue?style=for-the-badge&logo=react&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-ISC-orange?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19+-61dafb?style=for-the-badge&logo=react&logoColor=white)

**A robust full-stack feedback collection platform for CSE 21st Batch, Section B**

[🌐 Visit Live Site](#-live-deployment) • [📚 Documentation](#-project-structure) • [🚀 Quick Start](#-local-setup) • [🔐 Security](#-security-features)

</div>

---

## 🎯 Overview

A sophisticated full-stack feedback collection application designed for CSE 21st Batch, Section B students. Students submit **anonymous, one-time feedback** about two Course Representatives (CRs), while CRs access a **protected admin dashboard** with advanced filtering, analytics, and PDF export capabilities.

### ✨ Key Features

- 🔒 **Anonymous Submissions** – Completely private and untraceable feedback
- ⚡ **One-Time Submission** – Triple-layer protection against duplicate submissions (cookies, device fingerprinting, IP hashing)
- 📊 **Advanced Analytics** – Real-time statistics, trend analysis, and filterable insights
- 📄 **PDF Export** – Generate professional reports of feedback data
- 🎨 **Modern UI** – Custom "campus" theme with DaisyUI and Tailwind CSS
- 🔐 **Enterprise Security** – JWT authentication, input sanitization, rate limiting
- 📱 **Fully Responsive** – Seamless experience across all devices
- ⚙️ **Admin Dashboard** – Comprehensive CR management and feedback oversight

---

## 🌐 Live Deployment

🔗 **Website:** [https://feedback.no-idea.top/](https://feedback.no-idea.top/)

### Screenshot

![Feedback System Interface](./docs/screenshot.png)
> *Add a screenshot of your website here. Replace `./docs/screenshot.png` with the actual path to your screenshot*

---

## 🛠️ Technology Stack

### Frontend
```
React 19 (Vite) • Tailwind CSS + DaisyUI • Redux Toolkit
React Router • Framer Motion • React Hot Toast • Recharts
React Loading Skeleton • FingerprintJS
```

### Backend
```
Node.js • Express.js • MongoDB (Mongoose)
JWT Authentication • PDFKit • Bcrypt
Express Rate Limit • XSS Protection • Mongo Sanitization
```

---

## 📁 Project Structure

```
feedback-app/
│
├── backend/                          # Node.js/Express server
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   │
│   ├── models/
│   │   ├── Feedback.js              # Feedback data model
│   │   ├── Settings.js              # App settings model
│   │   └── Admin.js                 # Admin user model
│   │
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification
│   │   ├── duplicateGuard.js        # One-submission enforcement
│   │   ├── rateLimiter.js           # Rate limiting
│   │   └── errorHandler.js          # Error middleware
│   │
│   ├── controllers/
│   │   ├── feedbackController.js    # Feedback business logic
│   │   └── adminController.js       # Admin operations
│   │
│   ├── routes/
│   │   ├── feedbackRoutes.js        # Public feedback endpoints
│   │   └── adminRoutes.js           # Protected admin endpoints
│   │
│   ├── utils/
│   │   └── pdfGenerator.js          # PDF report generation
│   │
│   ├── server.js                    # Express app entry point
│   ├── seedAdmin.js                 # Admin account setup
│   └── package.json
│
├── frontend/                         # React + Vite application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── FeedbackForm.jsx     # Submission form
│   │   │   ├── ThankYou.jsx         # Success page
│   │   │   ├── AdminLogin.jsx       # CR login
│   │   │   └── AdminDashboard.jsx   # Analytics dashboard
│   │   │
│   │   ├── components/
│   │   │   ├── StarRating.jsx       # Rating component
│   │   │   └── ProtectedRoute.jsx   # Auth wrapper
│   │   │
│   │   ├── redux/
│   │   │   ├── store.js             # Redux store config
│   │   │   ├── feedbackSlice.js     # Feedback state
│   │   │   └── adminSlice.js        # Admin state
│   │   │
│   │   ├── api/
│   │   │   └── axios.js             # API client setup
│   │   │
│   │   ├── utils/
│   │   │   └── deviceFingerprint.js # Browser fingerprinting
│   │   │
│   │   └── App.jsx                  # Root component
│   │
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── .env.example                      # Environment variables template
└── README.md                         # This file
```

---

## 🚀 Local Setup

### Prerequisites
- **Node.js** v18+ and npm
- **MongoDB** (Atlas cloud or local instance)
- **Git**

### 1️⃣ Backend Configuration

```bash
# Navigate to backend directory
cd backend

# Create environment file
cp .env.example .env

# Fill in your environment variables:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# ADMIN_EMAIL=admin@example.com
# ADMIN_PASSWORD=your_secure_password

# Install dependencies
npm install

# Seed the admin account
node seedAdmin.js

# Start development server
npm run dev
# ✅ Backend running at http://localhost:5000
```

### 2️⃣ Frontend Configuration

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# ✅ Frontend running at http://localhost:5173
```

**Note:** The Vite dev server automatically proxies `/api` requests to `http://localhost:5000`, so no additional CORS configuration is needed during local development.

---

## 🔒 How the One-Submission Rule Works

The system implements a **triple-layer verification** to ensure genuine one-time submissions:

### Layer 1: HTTP-Only Cookies 🍪
- `fb_submitted` cookie set immediately after successful submission
- **Strongest protection** – inaccessible to JavaScript, survives localStorage wipes
- Persists across browser sessions

### Layer 2: Device Fingerprinting 📱
- Uses [FingerprintJS](https://github.com/fingerprintjs/fingerprintjs) (open-source)
- Combines multiple device signals:
  - Canvas rendering fingerprint
  - WebGL renderer strings
  - Audio context output
  - Screen resolution & color depth
  - Timezone & language settings

### Layer 3: IP-Based Detection 🌐
- Salted hash of requester's IP address
- **Raw IP is never stored** for privacy
- Catches repeated attempts from same network/location

**Result:** If ANY of the three signals match an existing record, submission is rejected with **409 Conflict**.

> ⚠️ **Note:** While significantly more robust than localStorage alone, this is not cryptographic identity verification. Use for academic/internal feedback only.

---

## 👨‍💼 Admin Dashboard Features

### Login
Access the admin panel at `/admin/login` with credentials seeded via `seedAdmin.js`

### Authentication
- JWT tokens stored in **httpOnly cookies** (primary) and localStorage (cross-origin fallback)
- Secure session management for deployed environments

### Dashboard Tabs

| Tab | Features |
|-----|----------|
| **📊 Overview** | Real-time statistics, rating trend chart (filterable by CR & date range), PDF export |
| **📋 Feedback** | Searchable feedback list with pagination, advanced filtering, sorting options |
| **⚙️ Settings** | Configure CR names, welcome messages, feedback prompts, submission windows |

---

## 🔐 Security Features

### Input & Output Protection
- ✅ **Express Mongo Sanitize** – Prevents NoSQL injection
- ✅ **XSS Protection** – `xss-clean` middleware on all inputs
- ✅ **Bcrypt Hashing** – 12-round password hashing (never stored in plain text)
- ✅ **Rate Limiting** – Global API limits + stricter limits on sensitive endpoints
- ✅ **CORS Configuration** – Properly scoped cross-origin requests

### Validation
- **Frontend & Backend** dual validation (never trust client-side alone)
- Rating constraints: **1–5 stars**
- Feedback field: **required, max 3000 characters**
- Request size limits to prevent DoS attacks

### Environment Security
- Sensitive credentials stored in `.env` (never committed)
- JWT secrets rotated per deployment
- MongoDB credentials isolated and never exposed

---

## 🌍 Deployment Notes (Render)

### Backend Deployment
```bash
# Deploy `backend/` as a Render Web Service
1. Push code to GitHub
2. Create Web Service → Connect repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables in Render dashboard:
   - MONGO_URI
   - JWT_SECRET
   - ADMIN_EMAIL
   - ADMIN_PASSWORD
   - CLIENT_URL (your frontend URL)
```

### Frontend Deployment
```bash
# Deploy `frontend/` as a Render Static Site
1. Build: `npm run build` (outputs to `dist/`)
2. Create Static Site → Connect repository
3. Set build command: `npm run build`
4. Set publish directory: `dist/`
5. Update API base URL in vite.config.js or environment variables
```

### API Integration
- **Option A (Recommended):** Use reverse proxy on same domain for `/api`
- **Option B:** Update `VITE_API_URL` with full backend URL + `withCredentials: true` in Axios config

---

## 📊 API Endpoints

### Public Endpoints
```
POST   /api/feedback/submit        # Submit new feedback
GET    /api/feedback/check-status  # Check submission status
```

### Protected Admin Endpoints
```
POST   /api/admin/login            # Admin authentication
GET    /api/admin/feedback         # Retrieve feedback (paginated)
GET    /api/admin/stats            # Get analytics data
GET    /api/admin/export-pdf       # Generate PDF report
PUT    /api/admin/settings         # Update settings
```

---

## 📝 Environment Variables Template

Create a `.env` file in the backend directory:

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/feedback

# JWT
JWT_SECRET=your_super_secret_key_change_in_production

# Admin Account
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=SecurePassword123!

# Frontend URL (for CORS & redirects)
CLIENT_URL=http://localhost:5173

# Node Environment
NODE_ENV=development
PORT=5000
```

---

## 🤝 Contributing

This project is designed for CSE 21B feedback collection. For improvements or bug reports:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License** – see the [LICENSE](./LICENSE) file for details.

**ISC License Summary:**
- ✅ Permissive open-source license
- ✅ Commercial use allowed
- ✅ Can modify and distribute
- ❌ No liability warranty
- ❌ Must include license notice

---

## 📞 Support & Contact

- **Author:** [Shahriyar Rahim](https://github.com/Shahriyar-Rahim)
- **Repository:** [github.com/Shahriyar-Rahim/feedback](https://github.com/Shahriyar-Rahim/feedback)
- **Issues:** [Report bugs here](https://github.com/Shahriyar-Rahim/feedback/issues)

---

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Mongoose Guide](https://mongoosejs.com/)
- [React 19 Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)

---

<div align="center">

### ⭐ If you found this helpful, consider starring the repository!

**Made with ❤️ by [Shahriyar Rahim](https://github.com/Shahriyar-Rahim)**

</div>
