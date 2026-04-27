import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Pizza as PizzaIcon, Search } from 'lucide-react';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/inventory/products');
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching menu:', err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 className="animate-spin text-primary" size={48} />
        <p>Preparing the kitchen...</p>
      </div>
    );
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pizzas = filteredProducts.filter(p => p.category === 'Pizza');
  const sides = filteredProducts.filter(p => p.category === 'Side');

  return (
    <div className="menu-page animate-fade px-4 py-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Our Kitchen <span className="text-primary">Specials</span></h1>
          <p className="text-secondary text-lg">Handcrafted dinner options prepared fresh by our chefs.</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={20} />
          <input 
            type="text" 
            placeholder="Search for pizzas, sides..." 
            className="w-full pl-12 pr-4 py-4 glass-card bg-white/5 border-white/10 rounded-2xl focus:border-primary outline-none transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {pizzas.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-primary uppercase tracking-widest flex items-center gap-3">
            <div className="h-1 w-12 bg-primary"></div> Specialty Pizzas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pizzas.map(item => (
              <div key={item._id} className="food-card glass-card hover:scale-[1.02] transition-transform duration-300">
                <div className="h-52 overflow-hidden rounded-t-3xl relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-primary font-bold">
                    ₹{item.price}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                  <p className="text-secondary text-sm mb-6 leading-relaxed line-clamp-2">{item.description}</p>
                  <Link to="/builder" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                    <PizzaIcon size={18} /> Order Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sides.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-secondary uppercase tracking-widest flex items-center gap-3">
            <div className="h-1 w-12 bg-secondary"></div> Premium Sides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sides.map(item => (
              <div key={item._id} className="food-card glass-card hover:scale-[1.02] transition-transform duration-300">
                <div className="h-52 overflow-hidden rounded-t-3xl relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-secondary font-bold">
                    ₹{item.price}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                  <p className="text-secondary text-sm mb-6 leading-relaxed line-clamp-2">{item.description}</p>
                  <Link to="/builder" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                    Order Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pizzas.length === 0 && sides.length === 0 && (
        <div className="text-center py-20 glass-card">
          <p className="text-xl text-secondary">No items found matching "{searchTerm}"</p>
          <button onClick={() => setSearchTerm('')} className="mt-4 text-primary font-bold">Clear search</button>
        </div>
      )}

      <div className="glass-card p-12 text-center bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
        <PizzaIcon size={64} className="text-primary mx-auto mb-6" />
        <h3 className="text-2xl font-extrabold mb-4">Want to create your own?</h3>
        <p className="text-secondary mb-8 max-w-md mx-auto">Use our interactive builder to craft a pizza that’s uniquely yours with any toppings you desire.</p>
        <Link to="/builder" className="btn-primary py-4 px-10 text-lg">Go to Pizza Builder</Link>
      </div>
    </div>
  );
};

export default Menu;

