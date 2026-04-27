# 🍕 Pizza Delivery App

A premium, full-stack MERN (MongoDB, Express, React, Node.js) Pizza Delivery Application featuring a Custom Pizza Builder, real-time order tracking, and seamless Razorpay payment integration.

## 🌟 Key Features

- **Premium UI/UX**: Glassmorphism design, dark mode aesthetics, and smooth animations (Framer Motion).
- **Custom Pizza Builder**: Interactive step-by-step pizza creator (Base, Sauce, Cheese, Veggies, Meats).
- **Cart & Fast Checkout**: Dynamic cart with live total calculations and one-click Razorpay payment processing.
- **Real-Time Order Tracking**: Live status updates via Socket.io (Order Placed ➔ Baking ➔ Out for Delivery).
- **Secure Authentication**: JWT-based user login and registration flows.

## 🛠 Tech Stack

- **Frontend**: React.js, Vite, Redux Toolkit, Framer Motion, Axios, Tailwind-like custom CSS.
- **Backend**: Node.js, Express.js, Socket.io.
- **Database**: MongoDB & Mongoose.
- **Payments**: Razorpay API.

---

## 🚀 How to Run the Project Locally

Follow these steps to set up and run the project on your local machine.

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas cluster URL)
- A [Razorpay](https://razorpay.com/) Test Account (for payment keys)

### 2. Clone / Setup the Repository
Open your terminal and navigate to the project folder:
```bash
cd "Pizza Delivery App"
```

### 3. Backend Setup
Navigate into the `server` directory, install dependencies, and start the API server.

```bash
# Navigate to the backend folder
cd server

# Install backend dependencies
npm install

# Start the backend development server (runs on port 5000)
npm run dev
```

**Environment Variables (`server/.env`)**
Create a `.env` file inside the `server` directory and add the following keys:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/pizza-app
JWT_SECRET=your_super_secret_jwt_key
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
```
*(Make sure MongoDB is running locally if using the localhost URI)*

### 4. Frontend Setup
Open a **new terminal window**, navigate into the `client` directory, install dependencies, and start the Vite dev server.

```bash
# Navigate to the frontend folder
cd client

# Install frontend dependencies
npm install

# Start the Vite development server (runs on port 5173)
npm run dev
```

### 5. Open the Application
Once both servers are running, open your browser and navigate to:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 📝 Important Notes for Testing

- **Bypassing Email Verification**: During local development, if you do not have an SMTP server configured, email verification has been temporarily bypassed in `authController.js` to allow test logins.
- **Admin Access**: Admin verification middleware has been temporarily disabled to allow easy testing of the Real-Time order tracking dashboard (`/track/:id`).
- **Payments**: Use Razorpay's official "Test Cards" to successfully simulate purchases without spending real money.
