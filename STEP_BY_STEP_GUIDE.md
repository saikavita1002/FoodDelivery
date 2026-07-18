# FoodDelivery — Step-by-Step Setup Guide (Vite + React + Node + MongoDB)

This guide takes you from an empty `FoodDelivery` folder to a fully running app, with both `backend` and `frontend` living side by side as siblings. Everything described here is already built for you in the `FoodDelivery.zip` provided alongside this guide — this document explains what each piece does and why, so you can run it confidently and explain it in an interview.

```
FoodDelivery/
├── backend/
└── frontend/
```

---

## 0. Prerequisites

| Tool | Check | Get it |
|---|---|---|
| Node.js v18+ | `node -v` | https://nodejs.org |
| npm (bundled with Node) | `npm -v` | — |
| MongoDB | — | Local install, or free MongoDB Atlas cluster |
| Code editor | — | VS Code recommended |
| Postman / Thunder Client | — | For testing the API independently of the frontend |

**Why Vite instead of Create React App?** Create React App is no longer actively maintained by its original team, and is noticeably slower to start up and rebuild on save. Vite starts a dev server almost instantly and is what most new React projects use today — a fair choice to mention if asked "why Vite" in an interview.

---

## 1. Open the project folder

Unzip `FoodDelivery.zip` and open the resulting `FoodDelivery` folder in your terminal/VS Code. You'll see exactly two folders inside: `backend` and `frontend`. Keep both — don't run any "create new project" wizard inside this folder, since that would overwrite what's already here.

---

## 2. Backend setup

```bash
cd FoodDelivery/backend
npm install
```

This reads `backend/package.json` and installs: `express`, `mongoose`, `dotenv`, `cors`, `bcryptjs`, `jsonwebtoken`, `multer` (plus `nodemon` for development).

### Create your environment file

Copy `backend/.env.example` to a new file named `backend/.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/food_delivery_db
JWT_SECRET=replace_this_with_a_long_random_secret_string
```

If you're using **MongoDB Atlas** instead of a local install, replace `MONGO_URI` with your Atlas connection string (looks like `mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/food_delivery_db`).

Replace `JWT_SECRET` with any long random string — this is what cryptographically signs your login tokens, so it should not be left as the placeholder value in any real deployment.

### (Optional but recommended) Seed sample data

```bash
npm run seed
```

This populates 5 users, 2 restaurants, 5 food items, a cart, and 3 orders in different statuses — so your app isn't empty the first time you open it. It prints test login credentials when done. Safe to re-run anytime (it clears the 5 collections first).

### Start the backend

```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected: ...
```

Leave this terminal running. If you see a MongoDB connection error instead, double-check `MONGO_URI` and that MongoDB is actually reachable (running locally, or your IP is allowlisted in Atlas).

---

## 3. Frontend setup (Vite)

Open a **second terminal** — keep the backend one running.

```bash
cd FoodDelivery/frontend
npm install
```

This installs `react`, `react-dom`, `react-router-dom`, `axios`, plus Vite itself and its React plugin (`vite`, `@vitejs/plugin-react`) as dev tools.

### Create your environment file

Copy `frontend/.env.example` to `frontend/.env`:

```
VITE_API_URL=http://localhost:5000/api
VITE_IMAGE_URL=http://localhost:5000/uploads
```

**Important Vite-specific detail:** environment variables in Vite must be prefixed with `VITE_` (not `REACT_APP_`, which is a Create React App convention) and must be accessed in code as `import.meta.env.VITE_API_URL` (not `process.env.REACT_APP_API_URL`). This project's code is already written this way — but if you ever copy code from a CRA tutorial, this is the detail to fix.

### Start the frontend

```bash
npm run dev
```

Vite will print something like:
```
  VITE v5.4.0  ready in 280 ms

  ➜  Local:   http://localhost:3000/
```

Open that URL in your browser. (This project's `vite.config.js` sets the port to `3000` specifically, to match this guide — Vite's own default is `5173` if you ever start a different project without that override.)

---

## 4. Confirm everything works end-to-end

If you ran `npm run seed`, log in with one of the printed test accounts. Otherwise, register a new account first.

1. Register/login as a **restaurant_owner** → go to "Dashboard" → add a restaurant → upload an image
2. Click "Manage Menu" on that restaurant → add a few food items
3. Log out, register/login as a regular **user**
4. Browse to the restaurant, add an item to cart
5. Go to Cart → enter a delivery address → Place Order
6. Check "My Orders" — should show status "Pending"
7. Log back in as the restaurant owner → Dashboard → Orders tab → change status to "Preparing"
8. Log back in as the customer → refresh "My Orders" → status should now read "Preparing"

If all 8 steps work, your full stack is running correctly.

---

*(Continued: project structure explained, Vite-specific code differences, and MongoDB Compass usage)*
## 5. Project structure — what's inside each folder

```
FoodDelivery/
├── README.md
├── backend/
│   ├── config/db.js
│   ├── models/{User,Restaurant,Food,Cart,Order}.js
│   ├── middleware/{auth,role,upload}.js
│   ├── controllers/{user,restaurant,food,cart,order}Controller.js
│   ├── routes/{user,restaurant,food,cart,order}Routes.js
│   ├── uploads/              ← uploaded images saved here
│   ├── seed.js                ← populates sample data
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── index.html             ← Vite entry HTML (lives at root, not in public/)
    ├── vite.config.js
    ├── src/
    │   ├── main.jsx           ← Vite entry point (equivalent of CRA's index.js)
    │   ├── App.jsx
    │   ├── index.css
    │   ├── components/{Navbar,ProtectedRoute}.jsx
    │   ├── pages/{Home,Login,Register,Restaurants,FoodDetails,Cart,Orders,Profile,Admin}.jsx
    │   ├── pages/Admin/{AdminRestaurants,AdminMenu,AdminOrders}.jsx
    │   ├── services/{api,userService,restaurantService,foodService,cartService,orderService}.js
    │   └── context/{AuthContext,CartContext}.jsx
    ├── .env.example
    └── package.json
```

### The backend is framework-agnostic — nothing changed here

A useful thing to understand: **switching from Create React App to Vite only affects the frontend.** Express, Mongoose, your models, controllers, JWT logic, and Multer uploads are completely unrelated to which frontend build tool you use — they're just an HTTP API that doesn't care who's calling it. If you already understood the backend from a previous walkthrough, none of that knowledge needs to change.

### What's actually different in the Vite frontend, concretely

**1. Entry point file location and name.**
CRA: `public/index.html` + `src/index.js`
Vite: `index.html` at the **project root** + `src/main.jsx`

Vite's `index.html` directly references the JS entry point with a script tag:
```html
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
```
This is different from CRA, where the connection between `index.html` and your React code is hidden inside webpack config you never see. Vite makes it explicit.

**2. File extensions: `.jsx` instead of `.js` for files containing JSX.**
This isn't strictly required by Vite (it can be configured to accept JSX in `.js` files), but it's the standard convention and this project follows it — any file with `<SomeComponent />` syntax in it is named `.jsx`; plain logic files (the `services/` folder) stay `.js`.

**3. Environment variables.**
CRA: `process.env.REACT_APP_API_URL`
Vite: `import.meta.env.VITE_API_URL`

Both the variable name prefix (`VITE_` vs `REACT_APP_`) *and* the way you read it in code (`import.meta.env` vs `process.env`) are different. This project's `services/api.js` uses the Vite form:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

**4. The dev server itself.**
CRA used webpack under the hood, bundling your entire app before serving it — slower, especially as the app grows. Vite serves your source files almost directly over native ES modules during development and only bundles for production at `npm run build` time. This is why Vite's dev server starts in milliseconds rather than seconds.

**5. `npm run dev` instead of `npm start`.**
Small thing, but worth knowing: Vite projects conventionally use `dev` as the script name for the development server, not `start`. Check `frontend/package.json`'s `scripts` block if you ever forget.

Everything else — the actual React component code, the Context API usage for auth/cart, react-router-dom routing, axios calls, the CSS — is identical in structure and logic to a CRA app. React itself doesn't know or care which build tool assembled it.

---

## 6. Using MongoDB Compass alongside this project

Compass is the official GUI for MongoDB — useful for visually inspecting your collections instead of only through code, and a good thing to demo live in an interview.

1. Download from **https://www.mongodb.com/try/download/compass** (free)
2. Open Compass, paste in the **same `MONGO_URI`** from your `backend/.env`, click Connect
3. You'll see a `food_delivery_db` database appear in the sidebar (it only appears once at least one document has been written — run `npm run seed` first if it's not showing)
4. Click into any collection (`users`, `restaurants`, `foods`, `carts`, `orders`) to see real documents
5. Use the filter bar to run queries directly, e.g. `{ "status": "Pending" }` in the `orders` collection
6. The **Schema** tab shows you field types and consistency across documents — useful for confirming your Mongoose schema is actually being respected in practice
7. To promote your first admin account (the API deliberately blocks self-registering as `admin`): find your user in the `users` collection, edit the `role` field from `"user"` to `"admin"`, click Update

---

## 7. Common first-run problems

| Symptom | Likely cause | Fix |
|---|---|---|
| `MongoDB connection error` on backend start | Wrong `MONGO_URI`, or MongoDB not running | Double-check `.env`; for Atlas, confirm your IP is allowlisted |
| Frontend loads but restaurant list is empty | Backend not running, or no data seeded | Confirm backend terminal shows "Server running on port 5000"; run `npm run seed` |
| `CORS error` in browser console | Backend not running, or wrong `VITE_API_URL` | Confirm backend is on port 5000 and `.env` matches |
| Images don't display | `VITE_IMAGE_URL` missing/wrong, or backend `uploads/` folder doesn't exist | Confirm `.env` points to `http://localhost:5000/uploads` |
| "Cannot find module" on `npm run dev` (frontend) | `npm install` wasn't run, or run in the wrong folder | Make sure you're inside `frontend/`, then `npm install` again |
| Login works but immediately logs out on refresh | `.env` missing or backend JWT_SECRET changed after token was issued | Re-login after fixing `.env`; old tokens become invalid if `JWT_SECRET` changes |

---

## Appendix: full file checklist

**`backend/`**: `config/db.js` · `models/{User,Restaurant,Food,Cart,Order}.js` · `middleware/{auth,role,upload}.js` · `controllers/{user,restaurant,food,cart,order}Controller.js` · `routes/{user,restaurant,food,cart,order}Routes.js` · `seed.js` · `server.js` · `.env.example` · `package.json` · `README.md`

**`frontend/src/`**: `services/{api,userService,restaurantService,foodService,cartService,orderService}.js` · `context/{AuthContext,CartContext}.jsx` · `components/{Navbar,ProtectedRoute}.jsx` · `pages/{Home,Login,Register,Restaurants,FoodDetails,Cart,Orders,Profile,Admin}.jsx` · `pages/Admin/{AdminRestaurants,AdminMenu,AdminOrders}.jsx` · `App.jsx` · `main.jsx` · `index.css` · plus `index.html`, `vite.config.js`, `.env.example`, `package.json` at the frontend root

Everything listed above is already written and included in `FoodDelivery.zip`.
