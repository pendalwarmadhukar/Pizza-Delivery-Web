import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import PizzaBuilder from './pages/PizzaBuilder';
import OrderTracking from './pages/OrderTracking';
import AdminDashboard from './pages/AdminDashboard';
import InventoryManagement from './pages/InventoryManagement';
import ProductManagement from './pages/ProductManagement';
import ProtectedRoute from './components/ProtectedRoute';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen relative overflow-hidden bg-dark">
        {/* Global Cinematic Glows */}
        <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-500/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
        <div className="fixed top-[30%] left-[30%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
        
        <div className="relative z-10">
          <Navbar />
          <main className="container mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/builder" element={<PizzaBuilder />} />
            
            {/* User Routes */}
            <Route path="/track-order/:id" element={
              <ProtectedRoute>
                <OrderTracking />
              </ProtectedRoute>
            } />
            
            <Route path="/my-orders" element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />


            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/inventory" element={
              <ProtectedRoute adminOnly={true}>
                <InventoryManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/products" element={
              <ProtectedRoute adminOnly={true}>
                <ProductManagement />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        </div>
      </div>
    </Router>
  );
}


export default App;

