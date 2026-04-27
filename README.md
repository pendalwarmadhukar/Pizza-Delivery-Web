<p align="center">
  <img src="./pizza_app_banner.png" width="100%" alt="Pizza Hub Banner">
</p>

<h3 align="center"><font color="#FF4D00">Premium Glassmorphism UI • Real-Time Tracking • Seamless Payments</font></h3>

<p align="center">
  <img src="https://img.shields.io/badge/REACT-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/NODE.JS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/EXPRESS.JS-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MONGODB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/RAZORPAY-02042B?style=for-the-badge&logo=razorpay&logoColor=white" />
  <img src="https://img.shields.io/badge/SOCKET.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Live-success?style=flat-square" />
  <img src="https://img.shields.io/badge/Type-Food_Tech-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/Version-2.0-blueviolet?style=flat-square" />
</p>

<p align="center">
  <b><a href="#-getting-started">Quick Start</a> &nbsp;·&nbsp;
  <a href="https://github.com/pendalwarmadhukar/Pizza-Delivery-Web">Repository</a> &nbsp;·&nbsp;
  <a href="https://github.com/pendalwarmadhukar/Pizza-Delivery-Web/issues">Report Bug</a> &nbsp;·&nbsp;
  <a href="https://github.com/pendalwarmadhukar/Pizza-Delivery-Web/issues">Request Feature</a></b>
</p>

<br/>
<p align="center">
  <b>Table of Contents</b><br/>
  <a href="#-overview">01 Overview</a> · <a href="#-whats-new-in-v20">02 What's New</a> · <a href="#-solution-architecture">03 Architecture</a> · <a href="#-tech-stack">04 Tech Stack</a><br/>
  <a href="#-core-features">05 Core Features</a> · <a href="#-project-structure">06 Project Structure</a> · <a href="#-getting-started">07 Getting Started</a><br/>
  <a href="#-environment-variables">08 Environment Variables</a> · <a href="#-api-reference">09 API Reference</a> · <a href="#-security--integrity">10 Security</a> · <a href="#-author">11 Author</a>
</p>
<br/>

## ◈ Overview
**Pizza Hub** is a production-ready, full-stack MERN application that redefines the digital pizza ordering experience. Built with a stunning **Glassmorphism UI** and a premium **orange `#FF4D00` brand identity**, it allows users to browse specialty pizzas, craft their own from scratch using an interactive builder, track their orders in real-time via Socket.io, and execute secure payments through Razorpay.

Whether you're craving a classic Margherita or a custom meat-heavy masterpiece, Pizza Hub delivers a premium, smooth, and interactive journey from oven to doorstep.

## ◈ What's New in v2.0

### 🐛 Critical Bug Fixes
| Fix | Description |
|---|---|
| **Routing Fixed** | Added `/menu` route to `App.jsx` — the Menu page was unreachable via URL |
| **Broken Links** | Fixed all `/build` links → `/builder` across the app |
| **500 Order Error** | Added upfront validation for `deliveryAddress`, `items`, and `totalAmount` before calling Razorpay |
| **Razorpay Error Handling** | Razorpay failures now return a clear `502` message instead of a generic 500 crash |
| **Socket.io ERR_CONNECTION** | Moved socket connection from module-level into `useEffect` — no longer connects on every page load |

### ✨ New Features
| Feature | Description |
|---|---|
| **Menu Page** | Full specialty pizza catalog with search bar and Veg/Non-Veg filters |
| **Skeleton Loaders** | Pulsing skeleton cards while pizza data loads for premium UX |
| **Delivery Address Collection** | Both PizzaBuilder and Home cart checkout now collect delivery address before payment |
| **Admin Product Management** | Admins can add, edit, and delete specialty pizzas from the Admin Dashboard |
| **User Profile Page** | Users can update their name, email, and change their password |
| **Mobile Hamburger Menu** | Fully responsive Navbar with a slide-in mobile menu |
| **React Router v7 Flags** | Opted into `v7_startTransition` and `v7_relativeSplatPath` — no more console warnings |

### 🎨 Design System Overhaul
| Improvement | Description |
|---|---|
| **Unified Brand Color** | Primary color updated to premium Pizza Orange `#FF4D00` everywhere |
| **CSS Architecture** | Consolidated utility system with responsive breakpoints (`sm:`, `md:`, `lg:`) |
| **Cross-Browser Support** | Added standard `background-clip` and `line-clamp` properties alongside `-webkit-` prefixes |
| **Title Gradient** | New `.title-gradient` utility for the hero title using the orange-to-gold gradient |
| **Glassmorphism Cards** | Standardized all cards to use `.glass-card` for a consistent premium look |

---

## ◈ Solution Architecture
| Stage | Component | What Happens |
|:---:|:---|:---|
| 01 | **Menu & Catalog** | Users browse specialty pizzas with search/filter or build custom from scratch. |
| 02 | **Custom Builder Engine** | Step-by-step React wizard: Base → Sauce → Cheese → Veggies → Meat with live pricing. |
| 03 | **Delivery Address** | Address collected via modal/sidebar before payment initialization. |
| 04 | **Atomic Stock Check** | Server validates ingredient availability *before* initializing payment to prevent dead-end orders. |
| 05 | **Razorpay Tunnel** | Secure, one-click payment processing using the official Razorpay SDK. |
| 06 | **Socket Data Stream** | Upon kitchen update, server emits status changes directly to the user's browser. |
| 07 | **Inventory Sync** | Automated stock deduction using MongoDB Sessions ensures ingredient levels are always accurate. |

## ◈ System Architecture
```text
┌──────────────────────────────────────────────────────────────────┐
│                        React Frontend                            │
│   Home · Menu (Search/Filter) · Pizza Builder · Order Tracker   │
│   Admin Dashboard · Inventory · Product Manager · User Profile   │
└──────────────────────────┬───────────────────────────────────────┘
                           │  REST API + Socket.io Events
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                   Express.js Backend                             │
│  ┌──────────────────┐      ┌────────────────────────────────┐    │
│  │ JWT Auth (RBAC)  │      │  Socket.io Event Emitter       │    │
│  │ Protected Routes │ ──►  │  (Order Status Broadcasting)   │    │
│  └──────────────────┘      └───────────────┬────────────────┘    │
│  ┌──────────────────────────────────────┐  │                     │
│  │ Razorpay Error Handling (try/catch)  │  │                     │
│  │ + Upfront Request Validation         │  │                     │
│  └──────────────────────────────────────┘  │                     │
└───────────────────────────────────────────┼─────────────────────┘
                                            │
                                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                   MongoDB Atlas (Database)                       │
│  User · Order (w/ deliveryAddress) · Inventory · Pizza           │
│  ACID-compliant stock deduction via Sessions                     │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                    Razorpay API Gateway                          │
│       Secure Payment + HMAC SHA256 Signature Verification        │
└──────────────────────────────────────────────────────────────────┘
```

## ◈ Tech Stack
| Layer | Technology | Role |
|---|---|---|
| **Frontend** | React 18, Redux Toolkit, Framer Motion | Dynamic UI, State Management, Premium Animations |
| **Routing** | React Router v6 (v7 flags enabled) | SPA navigation, protected routes |
| **Backend** | Node.js, Express.js | REST API, business logic, Razorpay proxy |
| **Real-Time** | Socket.io | Live bidirectional order status tracking |
| **Database** | MongoDB Atlas (Mongoose) | Persistent storage, Inventory tracking, RBAC |
| **Payments** | Razorpay SDK | Secure checkout, cryptographic signature verification |
| **Security** | Helmet, Joi, express-rate-limit, mongo-sanitize | Hardened headers, validation, DDoS protection |
| **UI Icons** | Lucide React | Consistent icon system throughout the app |
| **Alerts** | SweetAlert2 | Premium modal alerts and form prompts |

## ◈ Core Features

🍕 **Custom Pizza Builder**  
A 5-step interactive wizard to choose Base, Sauce, Cheese, Veggies, and Meats with live pricing and a real-time summary sidebar.

🛒 **Full Menu with Cart**  
Specialty pizza catalog with search, Veg/Non-Veg filter, animated skeleton loaders, and an add-to-cart system with quantity controls.

📍 **Delivery Address Flow**  
Address is collected (via textarea popup or sidebar) before Razorpay is initialized — preventing 500 errors from missing required fields.

💰 **Razorpay Integration**  
Secure checkout with HMAC SHA256 signature verification. Clear error messages if gateway fails.

📡 **Real-Time Order Tracking**  
Socket.io connection established *only when needed* (lazy connection) — tracks status from "Order Received" → "In Kitchen" → "Delivered".

👤 **User Profile**  
Account management page for updating name, email, and password.

🏭 **Admin Suite**  
- **Inventory Management**: Track and update ingredient stock levels  
- **Product Management**: Add, edit, and delete specialty pizzas  
- **Order Dashboard**: Update order statuses with real-time broadcasting  

📱 **Mobile Responsive**  
Hamburger navigation menu, responsive pizza grid, and stacked layouts on all screen sizes.

🌑 **Premium Design System**  
Custom CSS utility system with glassmorphism cards, animated gradients, skeleton loaders, and the `#FF4D00` orange brand identity.

## ◈ Project Structure
```text
Pizza-Delivery-App/
│
├── server/
│   ├── config/
│   │   ├── razorpay.js       # Razorpay SDK initialization
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   ├── orderController.js  # Order creation, verification, status (+ validation)
│   │   ├── authController.js   # Register, Login, JWT
│   │   ├── pizzaController.js  # Specialty pizza CRUD
│   │   └── inventoryController.js
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification + Admin RBAC
│   │   └── errorMiddleware.js  # Global error handler
│   ├── models/
│   │   ├── Order.js            # Includes deliveryAddress field
│   │   ├── User.js
│   │   ├── Pizza.js
│   │   └── Inventory.js
│   ├── routes/                 # API route definitions
│   └── index.js                # Express + Socket.io server entry
│
├── client/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx      # Responsive with hamburger menu
│       │   └── ProtectedRoute.jsx
│       ├── pages/
│       │   ├── Home.jsx        # Landing + cart with address prompt
│       │   ├── Menu.jsx        # Catalog with search & filters
│       │   ├── PizzaBuilder.jsx # Step-by-step builder + address
│       │   ├── OrderTracking.jsx # Real-time status (lazy socket)
│       │   ├── AdminDashboard.jsx
│       │   ├── InventoryManagement.jsx
│       │   ├── ProductManagement.jsx  # NEW: Admin pizza editor
│       │   ├── Profile.jsx            # NEW: User account page
│       │   └── MyOrders.jsx
│       ├── store/              # Redux Toolkit slices
│       ├── App.jsx             # Routing (React Router v7 flags)
│       └── index.css           # Design system & utility classes
│
└── README.md
```

## ◈ Getting Started

**1. Clone the Repository**
```bash
git clone https://github.com/pendalwarmadhukar/Pizza-Delivery-Web.git
cd "Pizza Delivery App"
```

**2. Backend Setup**
```bash
cd server
npm install
```
Create `server/.env` (see Environment Variables section below), then:
```bash
npm run dev
# Server boots on http://localhost:5000
```

**3. Frontend Setup**
```bash
cd client
npm install
npm run dev
# App available on http://localhost:5173
```

**4. Seed Database (Optional)**
```bash
cd server
node seed.js
# Populates inventory items and sample pizzas
```

## ◈ Environment Variables

Create a file at `server/.env` with the following:

```env
# Server
PORT=5000

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/pizzadb

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_refresh_secret

# Razorpay Payment Gateway
# Get keys from: https://dashboard.razorpay.com → Settings → API Keys
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# CORS
CLIENT_URL=http://localhost:5173
```

> ⚠️ **Note:** Never commit your `.env` file. It is already in `.gitignore`.

## ◈ API Reference

### Auth
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate & get JWT token | Public |

### Orders
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/orders` | Validate stock, create Razorpay order | Auth |
| `POST` | `/api/orders/verify` | Verify signature & deduct stock | Auth |
| `GET`  | `/api/orders/my` | Get current user's orders | Auth |
| `GET`  | `/api/orders` | Get all orders | Admin |
| `PUT`  | `/api/orders/:id/status` | Update status + broadcast via Socket | Admin |

### Pizza & Inventory
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET`  | `/api/pizza` | List all specialty pizzas | Public |
| `POST` | `/api/pizza` | Add a specialty pizza | Admin |
| `PUT`  | `/api/pizza/:id` | Update a pizza | Admin |
| `DELETE`| `/api/pizza/:id` | Delete a pizza | Admin |
| `GET`  | `/api/inventory` | View ingredient stock | Auth |
| `PUT`  | `/api/inventory/:id` | Update ingredient quantity | Admin |

### Config
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET`  | `/api/config/razorpay-key` | Get Razorpay public key | Auth |

## ◈ Security & Integrity
| Feature | Approach |
|---|---|
| **API Hardening** | `helmet` sets secure HTTP headers on every response |
| **NoSQL Injection** | `express-mongo-sanitize` sanitizes all user inputs |
| **Rate Limiting** | 100 requests per 15 min per IP via `express-rate-limit` |
| **Payment Verification** | HMAC SHA256 signature check for every Razorpay transaction |
| **Input Validation** | Upfront checks on `deliveryAddress`, `totalAmount`, `items` before DB operations |
| **RBAC** | Admin-only routes protected via `isAdmin` middleware |
| **Concurrency** | MongoDB Sessions prevent double-ordering during high traffic |
| **env Security** | All secrets in `.env` — never committed to version control |

## ◈ Known Limitations & Roadmap
- [ ] OTP / Phone-based Authentication
- [ ] Email notifications on order status change
- [ ] Live location tracking (GPS integration)
- [ ] Customer reviews & ratings system
- [ ] Loyalty points / discount coupon system
- [ ] PWA support for mobile app-like experience

## ◈ Author
**Madhukar Pendalwar**  
Full Stack Developer · UI/UX Designer · Solutions Architect

[![GitHub](https://img.shields.io/badge/GitHub-pendalwarmadhukar-black?style=flat-square&logo=github)](https://github.com/pendalwarmadhukar)

⭐ Star this repo if it helped you · 🍕 Order your favorite build today!

*Built with Passion · Optimized for Performance · Creating the future of Food-Tech*
