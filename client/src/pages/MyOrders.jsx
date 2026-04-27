import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Clock, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await axios.get('http://localhost:5000/api/orders/myorders', config);
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user.token]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 title-gradient">My Orders</h1>

      {loading ? (
        <div className="text-center py-20 text-secondary">Fetching your orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 glass-card">
          <p className="text-secondary text-lg mb-6">You haven't placed any orders yet.</p>
          <button onClick={() => navigate('/')} className="btn-primary">Order Now</button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={order._id} 
              className="glass-card p-6 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-lg">#{order._id.slice(-6).toUpperCase()}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === 'Delivered' ? 'bg-green-500/20 text-green-500' : 'bg-primary/20 text-primary'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-secondary text-sm flex items-center gap-2">
                  <Clock size={14} /> {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {order.items.map((item, i) => (
                    <span key={i} className="text-xs bg-white/5 px-2 py-1 rounded">
                      {item.name} {item.isCustom ? '(Custom)' : ''}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-bold mb-3">₹{order.totalAmount}</div>
                <button 
                  onClick={() => navigate(`/track-order/${order._id}`)}
                  className="flex items-center gap-2 text-primary hover:text-white transition"
                >
                  Track Order <ExternalLink size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
