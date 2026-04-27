import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RefreshCcw, Save, AlertTriangle, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(state => state.auth);

  const fetchInventory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/inventory');
      setInventory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUpdate = async (item) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/inventory/${item._id}`, item, config);
      Swal.fire('Updated', 'Inventory item saved', 'success');
      fetchInventory();
    } catch (err) {
      Swal.fire('Error', 'Failed to update inventory', 'error');
    }
  };

  const handleChange = (id, field, value) => {
    setInventory(prev => prev.map(item => 
      item._id === id ? { ...item, [field]: value } : item
    ));
  };

  const categories = ['Base', 'Sauce', 'Cheese', 'Veggies', 'Meat'];

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin" className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-4xl font-bold title-gradient">Inventory Control</h1>
      </div>

      <div className="grid gap-12">
        {categories.map(cat => (
          <section key={cat}>
            <h2 className="text-xl font-bold mb-6 text-secondary uppercase tracking-widest">{cat}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inventory.filter(item => item.category === cat).map(item => (
                <div key={item._id} className={`glass-card p-6 border-l-4 ${item.quantity < 20 ? 'border-red-500 bg-red-500/5' : 'border-primary'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-bold text-lg">{item.name}</span>
                    {item.quantity < 20 && <AlertTriangle className="text-red-500" size={20} />}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold text-secondary">Stock Quantity</label>
                      <input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => handleChange(item._id, 'quantity', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold text-secondary">Price (₹)</label>
                      <input 
                        type="number" 
                        value={item.price} 
                        onChange={(e) => handleChange(item._id, 'price', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <button 
                      onClick={() => handleUpdate(item)}
                      className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm"
                    >
                      <Save size={16} /> Save Changes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default InventoryManagement;
