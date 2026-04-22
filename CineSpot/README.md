# 🎬 CineSpot – Full-Stack Movie Discovery Platform

A production-ready, full-stack movie platform with cinematic design, **real-time AI face detection** via CineMood AI, debounced search, trailers, authentication, favorites, watch history, admin panel, and a full footer.

---

## 🚀 Tech Stack

| Layer      | Tech                                          |
|------------|-----------------------------------------------|
| Frontend   | React 18, Redux Toolkit, React Router v6      |
| Styling    | SCSS + CSS Variables (dark cinematic theme)   |
| Animation  | GSAP + ScrollTrigger                          |
| Face AI    | face-api.js (TinyFaceDetector + Expressions)  |
| Backend    | Node.js, Express.js                           |
| Database   | MongoDB Atlas (Mongoose ODM)                  |
| Auth       | JWT (JSON Web Tokens)                         |
| Movie Data | TMDB (The Movie Database) API                 |

---

## ⚙️ Setup

### 1. Install

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment Variables

**`frontend/.env`**
```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_API_BASE=http://localhost:5000/api
```

> Get a free key at: https://www.themoviedb.org/settings/api

### 3. Download face-api.js models

```bash
cd frontend
npm run download-models
```

Downloads 6 model files into `public/models/` automatically.

### 4. Run

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Open **http://localhost:5173**

---

## 🤖 CineMood AI — Real Face Detection Flow

```
Camera opens → face-api.js detects expression in real-time
→ 8 samples taken → dominant mood identified with confidence %
→ TMDB genres mapped → movies fetched → GSAP reveal animation
```

**Detected moods:** happy 😊 · sad 😢 · angry 😡 · fearful 😱 · disgusted 😤 · surprised 😲 · neutral 😐

**Graceful fallbacks:** camera denied → clear error · no face → popular picks · models missing → setup guide shown inline

---

## ✨ Features

| Feature | Description |
|---|---|
| 🏠 Home | GSAP hero slider + trending/popular rows |
| 🔍 Search | Debounced real-time + infinite scroll |
| 🎬 Details | Cast, genres, trailer modal, similar, auto-history |
| 🤖 CineMood AI | Real face expression detection → matched movies |
| ❤️ Favorites | Stored in MongoDB |
| 🕐 History | Auto-tracked on visit + trailer watch |
| 🔐 Auth | JWT register/login/logout |
| ⚙️ Admin | Movie CRUD + user management (ban/unban/delete) |
| 🦶 Footer | Brand, nav, features, social, copyright |
| 📱 Responsive | Mobile · Tablet · Desktop |

---

Built with ❤️ for cinema lovers.
