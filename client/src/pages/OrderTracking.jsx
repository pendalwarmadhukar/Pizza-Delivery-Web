import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { motion } from 'framer-motion';
import { ChefHat, Truck, CheckCircle, Package } from 'lucide-react';
import '../styles/Orders.css';

const OrderTracking = () => {
  const { id } = useParams();
  const [status, setStatus] = useState('Order Received');

  useEffect(() => {
    // Only connect when on this page
    const socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
    });

    socket.emit('join_order_room', id);

    socket.on('status_updated', (newStatus) => {
      setStatus(newStatus);
    });

    return () => {
      socket.off('status_updated');
      socket.disconnect(); // Clean up connection when leaving page
    };
  }, [id]);

  const steps = [
    { label: 'Order Received', icon: Package },
    { label: 'In Kitchen', icon: ChefHat },
    { label: 'Sent for Delivery', icon: Truck },
    { label: 'Delivered', icon: CheckCircle },
  ];

  const currentIdx = steps.findIndex(s => s.label === status);

  return (
    <div className="tracking-page-container">
      <h1 className="tracking-title title-gradient">Track Your Order</h1>
      <div className="tracking-id text-secondary">Order ID: {id}</div>
      
      <div className="tracking-card glass-card">
        <div className="tracking-steps-container">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx <= currentIdx;
            return (
              <div key={step.label} className="tracking-step-col">
                <div className={`tracking-icon-wrapper ${isActive ? 'active' : ''}`}>
                  <Icon size={28} />
                </div>
                <div className={`tracking-step-label ${isActive ? 'active' : ''}`}>
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Progress Line */}
        <div className="tracking-progress-bg">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
            className="tracking-progress-fill bg-primary"
          />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={status}
        className="tracking-current-status text-primary"
      >
        {status === 'Delivered' ? 'Enjoy your pizza!' : `Current Status: ${status}`}
      </motion.div>
    </div>
  );
};

export default OrderTracking;
