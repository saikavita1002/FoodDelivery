# FoodDelivery — Full MERN Stack Project

A complete Food Delivery Management System: **M**ongoDB + **E**xpress + **R**eact (Vite) + **N**ode.

```
FoodDelivery/
├── backend/     → Express API, MongoDB models, JWT auth, image uploads
└── frontend/    → React app (built with Vite)
```

Each folder is a separate Node project with its own `package.json` — this is normal for MERN apps, not a mistake. They run as two separate processes (two terminals) that talk to each other over HTTP.

**See `STEP_BY_STEP_GUIDE.md` for the full walkthrough** — installing prerequisites, setting up both folders, environment variables, running everything, and seeding sample data.

## Quick start (if you already know what you're doing)

```bash
# Terminal 1 — backend
cd backend
npm install
cp .env.example .env     # then edit MONGO_URI and JWT_SECRET
npm run seed              # optional: populate sample data
npm run dev                # runs on http://localhost:5000

# Terminal 2 — frontend
cd frontend
npm install
cp .env.example .env     # defaults already point to localhost:5000
npm run dev                # runs on http://localhost:3000
```

Open `http://localhost:3000` in your browser.
