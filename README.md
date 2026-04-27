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
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Stars-0-gray?style=flat-square" />
  <img src="https://img.shields.io/badge/Forks-0-gray?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Live-success?style=flat-square" />
  <img src="https://img.shields.io/badge/Type-Food_Tech-orange?style=flat-square" />
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
  <a href="#-overview">01 Overview</a> · <a href="#-problem-statement">02 Problem Statement</a> · <a href="#-solution-architecture">03 Solution Architecture</a> · <a href="#-system-architecture">04 System Architecture</a><br/>
  <a href="#-tech-stack">05 Tech Stack</a> · <a href="#-core-features">06 Core Features</a> · <a href="#-project-structure">07 Project Structure</a> · <a href="#-getting-started">08 Getting Started</a><br/>
  <a href="#-environment-variables">09 Environment Variables</a> · <a href="#-api-reference">10 API Reference</a> · <a href="#-security--integrity">11 Security & Integrity</a> · <a href="#-author">12 Author</a>
</p>
<br/>

## ◈ Overview
**Pizza Hub** is a state-of-the-art, full-stack MERN application that redefines the digital pizza ordering experience. Built with a stunning **Glassmorphism UI**, it allows users to craft their own pizzas from scratch using an interactive builder, track their orders in real-time via Socket.io, and execute secure payments through Razorpay integration.

Whether you're craving a classic Margherita or a custom meat-heavy masterpiece, Pizza Hub delivers a premium, smooth, and interactive journey from oven to doorstep.

## ◈ Problem Statement
Most local pizza delivery systems are archaic, slow, and lack transparency.
- **Lack of Customization** → Rigid menus that don't allow granular ingredient control.
- **Blind Waiting** → Users are left wondering where their pizza is after placing an order.
- **Poor Aesthetics** → Clunky interfaces that don't match the modern premium dining experience.
- **Inventory Mismatches** → Ordering items that are actually out of stock, leading to cancellations.

Pizza Hub solves this by providing a **Real-Time Data Pipeline** that ties inventory, kitchen status, and payment into a single cohesive ecosystem.

## ◈ Solution Architecture
Pizza Hub implements a high-performance MERN architecture across five stages:

| Stage | Component | What Happens |
|:---:|:---|:---|
| 01 | **Custom Builder Engine** | Users select Base, Sauce, Cheese, and toppings; the React engine calculates price and quantity in real-time. |
| 02 | **Atomic Stock Check** | Server validates ingredient availability *before* initializing payment to prevent dead-end orders. |
| 03 | **Razorpay Tunnel** | Secure, one-click payment processing using the official Razorpay SDK & Webhooks. |
| 04 | **Socket Data Stream** | Upon kitchen update, the server emits status changes (Baking, Out for Delivery) directly to the user's dashboard. |
| 05 | **Inventory Sync** | Automated stock deduction using MongoDB Sessions ensures ingredient levels are always accurate. |

## ◈ System Architecture
```text
┌─────────────────────────────────────────────────────────────────┐
│                        User Dashboard                           │
│     Customizes Pizza  ·  Views Real-time Status Stepper         │
└──────────────────────────────┬──────────────────────────────────┘
                               │  Socket.io Events + REST API
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Express.js backend                            │
│                                                                 │
│  ┌────────────────────┐      ┌──────────────────────────────┐   │
│  │ JWT Authentication │      │   Socket.io Event Emitter    │   │
│  │ (Protected Routes) │ ──►  │ (Order Status Broadcasting)  │   │
│  └────────────────────┘      └──────────────┬───────────────┘   │
└─────────────────────────────────────────────┼───────────────────┘
                                              │ 
                                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas (Database)                     │
│                                                                 │
│  Stores User Data, Inventory Levels, and Order History.         │
│  Maintains ACID compliance for stock deduction.                 │
└──────────────────────────────┬──────────────────────────────────┘
                               │  Inventory Sync
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Razorpay API Gateway                       │
│       Handles Secure Payments & Webhook Verification            │
└─────────────────────────────────────────────────────────────────┘
```

## ◈ Tech Stack
| Layer | Technology | Role |
|---|---|---|
| **Frontend** | React 18, Redux Toolkit, Framer Motion | Dynamic UI, State Management, Premium Animations |
| **Backend** | Node.js, Express.js, Socket.io | Real-time events, REST API, Razorpay Proxy |
| **Database** | MongoDB Atlas (Mongoose) | Persistent storage, Inventory tracking, User RBAC |
| **Real-Time**| Socket.io | Live bidirectional order tracking |
| **Security** | Helmet, Joi, rate-limit | Hardened API headers, Input validation, DDoS protection |

## ◈ Core Features
🍕 **Custom Pizza Builder**
A step-by-step interactive engine to choose Base, Sauce, Cheese, Veggies, and Meats with live pricing.

📡 **Real-Time Tracking**
Watch your pizza progress through "Order Received", "Baking", and "Out for Delivery" statuses without refreshing the page.

💰 **Razorpay Integration**
Secure and fast checkout flow with cryptographically verified payment signatures.

🏭 **Admin Inventory Control**
A dedicated dashboard for restaurant owners to manage stock levels and update order statuses instantly.

🌑 **Premium Aesthetics**
A custom Design System featuring glassmorphism cards, blurred backgrounds, and sleek dark mode gradients.

## ◈ Project Structure
```text
Pizza-Delivery-App/
│
├── server/
│   ├── config/             # Connection logic & API configurations
│   ├── controllers/        # Order, Auth, Inventory, and Pizza logic
│   ├── middleware/         # JWT, Admin check, and Error Handling
│   ├── models/             # Mongoose Schemas (User, Order, Inventory)
│   ├── routes/             # API Endpoint definitions
│   └── index.js            # Express & Socket.io server entry
│
├── client/
│   ├── src/
│   │   ├── components/     # UI Components (Navbar, Stepper, etc.)
│   │   ├── pages/          # Home, Builder, Dashboard, Admin screens
│   │   ├── store/          # Redux Toolkit Slices (Builder, Auth, Orders)
│   │   └── App.jsx         # Main routing and global state
│   └── index.html          # Vite entry point
│
├── .gitignore              # Variable leak protection
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
Create `server/.env` and add:
```env
PORT=5000
MONGO_URI=your_mongodb_cluster_url
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```
```bash
npm run dev
# Server boots on http://localhost:5000
```

**3. Frontend Setup**
```bash
cd client
npm install
npm run dev
# Dashboard available on http://localhost:5173
```

## ◈ API Reference
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user with validation | Public |
| `POST` | `/api/auth/login` | Authenticate & obtain JWT token | Public |
| `POST` | `/api/orders` | Check stock & initiate Razorpay order | Authenticated |
| `POST` | `/api/orders/verify` | Verify signature & deduct stock | Authenticated |
| `GET`  | `/api/inventory` | View current ingredient levels | Admin |
| `PUT`  | `/api/orders/:id` | Broadcast status update via Socket | Admin |

## ◈ Security & Integrity
| Feature | Approach |
|---|---|
| **Data Protection** | API hardened with `helmet` headers and NoSQL injection protection using `mongo-sanitize`. |
| **Verification** | Cryptographic HMAC SHA256 signature verification for every Razorpay transaction. |
| **Input Validation** | All requests filtered through `Joi` schemas to prevent malformed data. |
| **Concurrency** | MongoDB Sessions ensure stock isn't "double-ordered" during high traffic. |

## ◈ Author
**Madhukar Pendalwar**  
Full Stack Developer · UI/UX Designer · Solutions Architect  

⭐ Star this repo if it helped you · 🍕 Order your favorite build today!

Built with Passion · Optimized for Performance · Creating the future of Food-Tech
