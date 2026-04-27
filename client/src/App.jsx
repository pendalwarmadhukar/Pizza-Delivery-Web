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
import Footer from './components/Footer';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen relative bg-dark">
        <Navbar />
        <main>
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
        <Footer />
      </div>
    </Router>
  );
}


export default App;

