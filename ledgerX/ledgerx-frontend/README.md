# LedgerX — Smart Finance Tracking Frontend

A premium, animated fintech dashboard built with React + Vite + Tailwind + Framer Motion.

## Tech Stack
- **React 18** + **Vite** (fast dev server)
- **Tailwind CSS** (utility-first styling)
- **Framer Motion** (page & component animations)
- **Axios** (API calls with credentials: include)
- **Recharts** (balance trend chart)
- **React Router v6** (client-side routing)

---

## Setup Instructions

### 1. Install dependencies

```bash
cd ledgerx
npm install
```

### 2. Configure environment

Create a `.env` file in the root (already included):

```env
VITE_API_URL=http://localhost:5000/api
```

Change the URL to match your running backend.

### 3. Configure your backend for CORS

In your Express backend, add:

```js
const cors = require('cors')
app.use(cors({
  origin: 'http://localhost:5173',  // Vite dev server
  credentials: true,                // Required for cookies/JWT
}))
```

### 4. Start dev server

```bash
npm run dev
```

Visit: **http://localhost:5173**

---

## API Routes Expected

The frontend assumes these backend REST API routes:

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register user → `{ token, user }` |
| POST | `/api/auth/login` | Login → `{ token, user }` |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions` | Create transaction `{ amount, type, description }` |

**Transaction object shape:**
```json
{
  "_id": "...",
  "amount": 150.00,
  "type": "credit",
  "description": "Freelance payment",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Auth response shape:**
```json
{
  "token": "eyJhbGci...",
  "user": { "_id": "...", "name": "John", "email": "john@email.com" }
}
```

---

## Project Structure

```
src/
├── components/
│   ├── AppLayout.jsx       — Authenticated page shell (navbar + footer)
│   ├── Footer.jsx
│   ├── LoadingScreen.jsx
│   ├── Navbar.jsx
│   ├── SkeletonLoader.jsx  — Shimmer loading states
│   ├── StatCard.jsx        — Dashboard metric card
│   └── TransactionRow.jsx  — Transaction list item
├── context/
│   └── AuthContext.jsx     — Global auth state
├── pages/
│   ├── LandingPage.jsx     — Public marketing page
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx   — Balance, chart, recent transactions
│   ├── TransactionsPage.jsx — Full list with filter/sort/search
│   └── CreateTransactionPage.jsx
├── services/
│   └── api.js              — Axios instance + all API calls
├── App.jsx                 — Routes
├── main.jsx
└── index.css               — Tailwind + global component classes
```

---

## Build for Production

```bash
npm run build
```

Output goes to `dist/`. Deploy to Vercel, Netlify, or any static host.

---

## Features

- ✅ JWT auth with localStorage (+ `credentials: include` for cookie fallback)
- ✅ Protected routes (redirect to /login if not authenticated)
- ✅ Dashboard with balance calculation, 7-day chart, recent transactions
- ✅ Full transaction list with search, filter (credit/debit), and sort
- ✅ Create transaction with live preview card
- ✅ Framer Motion animations throughout
- ✅ Skeleton loading states
- ✅ Responsive (mobile, tablet, desktop)
- ✅ Premium dark fintech aesthetic (volt-green + obsidian)
