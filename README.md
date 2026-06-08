# Maison — E-Commerce Store

A full-stack-ready React e-commerce storefront built as a portfolio project.

## Tech Stack
- **React 18** — UI framework
- **React Router v6** — client-side routing
- **Vite** — dev server and bundler
- **Context API** — global state (cart, auth)
- **LocalStorage** — mock persistence (replace with real backend)

## Features Built
- [x] Product listing with category filtering
- [x] Product detail pages
- [x] Sliding cart drawer with qty controls
- [x] User registration and login (with validation)
- [x] Protected checkout flow
- [x] 3-step checkout (shipping → payment → confirm)
- [x] Order history page
- [x] Fully responsive layout

## Project Structure
```
src/
├── components/
│   ├── layout/       # Navbar
│   └── cart/         # CartDrawer
├── context/
│   ├── AuthContext   # User auth state
│   └── CartContext   # Cart state
├── lib/
│   └── products.js   # Product data
├── pages/
│   ├── HomePage      # Hero + product grid
│   ├── ProductPage   # Individual product
│   ├── AuthPage      # Login / Register
│   ├── CheckoutPage  # 3-step checkout
│   └── OrdersPage    # Order history
└── styles/
    └── globals.css   # Design tokens + utilities
```

## Getting Started
```bash
npm install
npm run dev
```

## Next Steps (Week 2+)
- [ ] Connect to real backend (Node.js + Express + PostgreSQL)
- [ ] Replace mock auth with JWT + bcrypt
- [ ] Integrate Stripe for real payments
- [ ] Add admin panel (add/edit/delete products)
- [ ] Deploy: Vercel (frontend) + Railway (backend)
