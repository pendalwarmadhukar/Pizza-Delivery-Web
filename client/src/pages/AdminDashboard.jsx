import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Clock, RefreshCcw, CheckCircle, Package, Truck, ChefHat } from 'lucide-react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(state => state.auth);

  const fetchAllOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get('http://localhost:5000/api/orders/all', config);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus }, config);
      Swal.fire('Updated', `Status changed to ${newStatus}`, 'success');
      fetchAllOrders();
    } catch (err) {
      Swal.fire('Error', 'Failed to update status', 'error');
    }
  };

  const statusIcons = {
    'Order Received': Package,
    'In Kitchen': ChefHat,
    'Sent for Delivery': Truck,
    'Delivered': CheckCircle
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold title-gradient">Admin Panel</h1>
        <div className="flex gap-4">
          <Link to="/admin/inventory" className="btn-primary">Manage Inventory</Link>
          <button onClick={fetchAllOrders} className="bg-white/5 p-3 rounded-xl hover:bg-white/10 transition">
            <RefreshCcw size={20} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-secondary">Loading orders...</div>
      ) : (
        <div className="grid gap-6">
          {orders.map(order => (
            <motion.div 
              layout
              key={order._id} 
              className="glass-card p-6 flex items-center justify-between gap-6"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-lg">#{order._id.slice(-6).toUpperCase()}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.paymentStatus === 'Completed' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="text-secondary text-sm">
                  User: {order.user?.name} ({order.user?.email})
                </div>
                <div className="mt-2 text-sm">
                  {order.items.map((item, i) => (
                    <span key={i} className="inline-block bg-white/5 px-2 py-1 rounded mr-2">
                      {item.name} {item.isCustom ? `(${item.config.base}, ${item.config.sauce})` : ''}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-bold mb-3 text-primary">₹{order.totalAmount}</div>
                <div className="flex gap-2">
                  {['Order Received', 'In Kitchen', 'Sent for Delivery', 'Delivered'].map(status => {
                    const Icon = statusIcons[status];
                    const isCurrent = order.status === status;
                    return (
                      <button
                        key={status}
                        onClick={() => updateStatus(order._id, status)}
                        title={status}
                        className={`p-3 rounded-lg transition-all ${isCurrent ? 'bg-primary text-white' : 'bg-white/5 text-secondary hover:bg-white/10'}`}
                      >
                        <Icon size={18} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
