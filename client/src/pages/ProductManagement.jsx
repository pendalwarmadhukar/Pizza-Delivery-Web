import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Plus, Trash2, Edit2, Save, X, Image as ImageIcon } from 'lucide-react';
import Swal from 'sweetalert2';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { user } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Pizza',
    type: 'Veg',
    image: ''
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/pizza');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (editingProduct) {
        // Update logic (assuming PUT /api/pizza/:id exists or using POST for now if not)
        await axios.post('http://localhost:5000/api/pizza', formData, config); 
      } else {
        await axios.post('http://localhost:5000/api/pizza', formData, config);
      }
      Swal.fire('Success', 'Product saved successfully', 'success');
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', category: 'Pizza', type: 'Veg', image: '' });
      fetchProducts();
    } catch (err) {
      Swal.fire('Error', 'Failed to save product', 'error');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold title-gradient">Product Management</h1>
          <p className="text-secondary">Manage your specialty pizzas and sides here.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 py-3 px-6"
        >
          <Plus size={20} /> Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <div key={product._id} className="glass-card overflow-hidden group">
            <div className="h-48 relative">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition">
                  <Edit2 size={20} />
                </button>
                <button className="p-3 bg-red-500/20 backdrop-blur-md rounded-full text-red-500 hover:bg-red-500/40 transition">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{product.name}</h3>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${product.type === 'Veg' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {product.type}
                </span>
              </div>
              <p className="text-secondary text-sm mb-6 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                <span className="text-secondary text-xs uppercase tracking-widest">{product.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-dark border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden animate-fade-in">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Add New Product</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
                <label className="text-xs font-bold text-secondary uppercase">Product Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full" 
                  placeholder="e.g. Dynamic Margherita"
                />
              </div>

              <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
                <label className="text-xs font-bold text-secondary uppercase">Price (₹)</label>
                <input 
                  required
                  type="number" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full" 
                  placeholder="299"
                />
              </div>

              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-xs font-bold text-secondary uppercase">Description</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full min-h-[100px]" 
                  placeholder="Describe the toppings and flavor profile..."
                ></textarea>
              </div>

              <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
                <label className="text-xs font-bold text-secondary uppercase">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-white/5 border-white/10 rounded-xl p-3 text-white outline-none"
                >
                  <option value="Pizza">Pizza</option>
                  <option value="Side">Side</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
                <label className="text-xs font-bold text-secondary uppercase">Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-white/5 border-white/10 rounded-xl p-3 text-white outline-none"
                >
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-xs font-bold text-secondary uppercase">Image URL</label>
                <div className="flex gap-4">
                  <input 
                    required
                    type="text" 
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="flex-1" 
                    placeholder="https://images.unsplash.com/..."
                  />
                  <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
                    {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <ImageIcon className="text-secondary" />}
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary col-span-2 py-4 mt-4 flex items-center justify-center gap-2">
                <Save size={20} /> Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
