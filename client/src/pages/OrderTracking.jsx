import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { motion } from 'framer-motion';
import { ChefHat, Truck, CheckCircle, Package } from 'lucide-react';

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
    <div className="p-8 max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-12 title-gradient">Track Your Order</h1>
      <div className="text-secondary mb-4">Order ID: {id}</div>
      
      <div className="glass-card p-10 relative overflow-hidden">
        <div className="flex justify-between relative z-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx <= currentIdx;
            return (
              <div key={step.label} className="flex flex-col items-center gap-4 flex-1">
                <div className={`p-4 rounded-full transition-all duration-500 ${isActive ? 'bg-primary text-white scale-110 shadow-[0_0_20px_rgba(255,77,0,0.4)]' : 'bg-white/5 text-secondary'}`}>
                  <Icon size={28} />
                </div>
                <div className={`text-xs font-bold uppercase transition-colors duration-500 ${isActive ? 'text-white' : 'text-secondary/50'}`}>
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Progress Line */}
        <div className="absolute top-[68px] left-[15%] right-[15%] h-1 bg-white/5 -z-0">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
            className="h-full bg-primary"
          />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={status}
        className="mt-12 text-2xl font-bold text-primary"
      >
        {status === 'Delivered' ? 'Enjoy your pizza!' : `Current Status: ${status}`}
      </motion.div>
    </div>
  );
};

export default OrderTracking;
