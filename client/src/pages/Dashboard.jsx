import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import StatusStepper from '../components/StatusStepper';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orders/myorders');
        setOrders(res.data);
        
        // Join rooms for active orders
        res.data.forEach(order => {
          if (order.status !== 'Delivered') {
            socket.emit('join_order_room', order._id);
          }
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();

    socket.on('statusUpdate', ({ orderId, status }) => {
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    });

    return () => socket.off('statusUpdate');
  }, []);

  return (
    <div className="dashboard animate-fade">
      <h1>Welcome back, {user?.name}!</h1>
      <div className="orders-section">
        <h2>Your Orders</h2>
        {orders.length === 0 ? (
          <p>You haven't ordered any pizzas yet. Go to the builder!</p>
        ) : (
          orders.map(order => (
            <div key={order._id} className="order-card glass-card">
              <div className="order-header">
                <div>
                  <p className="order-id">Order ID: {order._id.substring(0, 8)}...</p>
                  <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="order-price">₹{order.totalPrice}</div>
              </div>
              
              <div className="order-details">
                <p><strong>Config:</strong> {order.pizzaConfig.base}, {order.pizzaConfig.sauce}, {order.pizzaConfig.cheese}</p>
                {order.pizzaConfig.veggies.length > 0 && <p><strong>Veggies:</strong> {order.pizzaConfig.veggies.join(', ')}</p>}
                {order.pizzaConfig.meat !== 'No Meat' && <p><strong>Meat:</strong> {order.pizzaConfig.meat}</p>}
              </div>

              <StatusStepper currentStatus={order.status} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
