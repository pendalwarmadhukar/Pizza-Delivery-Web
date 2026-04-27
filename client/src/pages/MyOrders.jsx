import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Clock, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Orders.css';

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
    <div className="orders-page-container">
      <h1 className="orders-title title-gradient">My Orders</h1>

      {loading ? (
        <div className="orders-loading text-secondary">Fetching your orders...</div>
      ) : orders.length === 0 ? (
        <div className="orders-empty glass-card">
          <p className="orders-empty-text text-secondary">You haven't placed any orders yet.</p>
          <button onClick={() => navigate('/')} className="btn-primary">Order Now</button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={order._id} 
              className="glass-card order-card"
            >
              <div className="order-info">
                <div className="order-header">
                  <span className="order-id">#{order._id.slice(-6).toUpperCase()}</span>
                  <span className={`order-status ${
                    order.status === 'Delivered' ? 'status-delivered' : 'status-pending'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-date text-secondary">
                  <Clock size={14} /> {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div className="order-items-list">
                  {order.items.map((item, i) => (
                    <span key={i} className="order-item-badge">
                      {item.name} {item.isCustom ? '(Custom)' : ''}
                    </span>
                  ))}
                </div>
              </div>

              <div className="order-actions">
                <div className="order-price">₹{order.totalAmount}</div>
                <button 
                  onClick={() => navigate(`/track-order/${order._id}`)}
                  className="track-order-btn"
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
