# Maison — Full Stack E-Commerce Store

A production-ready e-commerce platform built from scratch with React, Node.js, Express, and PostgreSQL. Live demo deployed on Vercel and Railway.

🔗 **Live Site:** [maison-store-phi.vercel.app](https://maison-store-phi.vercel.app)

## Tech Stack

**Frontend**
- React 18 + Vite
- React Router v6
- Context API (cart, auth state)
- CSS-in-JS with CSS variables
- LocalStorage persistence

**Backend**
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT authentication + bcrypt
- RESTful API design

**Infrastructure**
- Frontend deployed on **Vercel**
- Backend + Database deployed on **Railway**
- Images hosted on **Cloudinary**

## Features

### Customer-facing
- [x] Homepage with hero banner and featured products
- [x] Shop page — search, category filters, price range slider, sorting
- [x] Collections page — 8 categories with dedicated hero images
- [x] Product detail pages with image galleries
- [x] Product search (`/search?q=...`)
- [x] Shopping cart with quantity controls — persists across refresh
- [x] User registration & login (JWT)
- [x] 3-step checkout with field validation
- [x] Cash on Delivery payment
- [x] Order history per user
- [x] Fully responsive (mobile, tablet, desktop)
- [x] Custom 404 page
- [x] About page with team & values

### Admin
- [x] Admin-only dashboard (`/admin`)
- [x] Create / edit / delete products
- [x] Upload product images directly to Cloudinary
- [x] Manage 8 product categories
- [x] View all products in a sortable table

## Project Structure

```
maison-store/                  # Frontend (React + Vite)
├── public/
│   └── images/                # Local hero/category images
├── src/
│   ├── components/
│   │   ├── layout/             # Navbar, Footer
│   │   ├── cart/                # CartDrawer
│   │   └── product/            # ProductImage
│   ├── context/
│   │   ├── AuthContext.jsx     # JWT auth state
│   │   └── CartContext.jsx     # Cart state + localStorage
│   ├── lib/
│   │   ├── api.js              # Backend API calls
│   │   ├── categories.js       # Category config (images, colors)
│   │   └── cloudinary.js       # Image upload helper
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ShopPage.jsx
│   │   ├── CollectionsPage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── ProductPage.jsx
│   │   ├── SearchPage.jsx
│   │   ├── AuthPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── AdminPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── App.jsx
│   └── main.jsx
└── package.json

maison-backend/                # Backend (Node.js + Express)
├── prisma/
│   ├── schema.prisma           # User, Product, Order, OrderItem models
│   └── seed.js                 # Initial product data
├── src/
│   ├── controllers/             # auth, products, orders, payments
│   ├── middleware/
│   │   └── auth.js              # JWT protect + adminOnly
│   ├── routes/
│   │   └── index.js              # All API routes
│   ├── lib/
│   │   └── prisma.js             # Prisma client
│   └── index.js                  # Express server
└── package.json
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | Sign in |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/products` | ❌ | List products (supports `?category=`) |
| GET | `/api/products/:id` | ❌ | Single product |
| POST | `/api/products` | 👑 Admin | Create product |
| PUT | `/api/products/:id` | 👑 Admin | Update product |
| DELETE | `/api/products/:id` | 👑 Admin | Delete product |
| POST | `/api/orders` | ✅ | Place order |
| GET | `/api/orders` | ✅ | Get my orders |
| GET | `/api/admin/orders` | 👑 Admin | Get all orders |

## Local Development

### Frontend
```bash
cd maison-store
npm install
npm run dev
# → http://localhost:5173
```

### Backend
```bash
cd maison-backend
npm install
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET
npx prisma generate
npx prisma db push
node prisma/seed.js
npm run dev
# → http://localhost:4000
```

## Environment Variables

**Backend (`.env`)**
```
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
CLIENT_URL="https://your-frontend-url.vercel.app"
```

**Frontend (Vercel env vars)**
```
VITE_API_URL="https://your-backend-url.up.railway.app/api"
```

## Deployment

- **Frontend:** Vercel (auto-deploys from GitHub `main` branch)
- **Backend:** Railway (auto-deploys from GitHub `main` branch)
- **Database:** PostgreSQL on Railway (same project as backend)
- **Images:** Cloudinary unsigned upload preset

## What I Learned Building This

- Designing a relational schema (Users, Products, Orders, OrderItems) with Prisma
- Implementing JWT authentication with protected and role-based routes
- Building a REST API with Express middleware for auth and admin checks
- Managing global state in React with Context API (cart + auth)
- Persisting cart state to localStorage to survive page refreshes
- Integrating a third-party image upload service (Cloudinary) with unsigned presets
- Deploying a full-stack app across two platforms (Vercel + Railway) and wiring CORS correctly between them
- Debugging real production issues: case-sensitive file paths on Linux, Vercel build permission errors, and database connection strings (internal vs public)
- Building fully responsive layouts from scratch with CSS Grid and media queries

## Default Admin Account
```
Email: admin@maison.com
Password: admin123
```

## Author
Hamza Shahid Choudhary
GitHub: [@hamzashahidchoudhary](https://github.com/hamzashahidchoudhary)
