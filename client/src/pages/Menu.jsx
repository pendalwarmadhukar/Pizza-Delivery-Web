import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Pizza as PizzaIcon, Search, Filter, Leaf, Utensils } from 'lucide-react';
import Skeleton from '../components/Skeleton';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState('All'); // All, Veg, Non-Veg

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/pizza');
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching menu:', err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = activeType === 'All' || p.type === activeType;
    return matchesSearch && matchesType;
  });

  const pizzas = filteredProducts.filter(p => p.category === 'Pizza');
  const sides = filteredProducts.filter(p => p.category === 'Side');

  if (loading) {
    return (
      <div className="menu-page px-4 py-12 max-w-7xl mx-auto">
        <div className="h-12 w-64 mb-8"><Skeleton className="h-full w-full" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-card overflow-hidden h-96">
              <Skeleton className="h-52 w-full" />
              <div className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-6" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="menu-page animate-fade px-4 py-12 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 title-gradient">Our Kitchen Specials</h1>
          <p className="text-secondary text-lg">Handcrafted dinner options prepared fresh by our chefs.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Category Filter */}
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            {['All', 'Veg', 'Non-Veg'].map(type => (
              <button 
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeType === type ? 'bg-primary text-white shadow-lg' : 'text-secondary hover:text-white'}`}
              >
                {type === 'Veg' && <Leaf size={14} />}
                {type === 'Non-Veg' && <Utensils size={14} />}
                {type}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={20} />
            <input 
              type="text" 
              placeholder="Search for pizzas, sides..." 
              className="w-full pl-12 pr-4 py-3.5 glass-card bg-white/5 border-white/10 rounded-2xl focus:border-primary outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                    <div className={`h-2 w-2 rounded-full ${item.type === 'Veg' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-[10px] font-bold uppercase">{item.type}</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-primary px-3 py-1 rounded-full text-white font-bold text-sm">
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
                  <div className="absolute top-4 right-4 bg-secondary px-3 py-1 rounded-full text-white font-bold text-sm">
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

      {filteredProducts.length === 0 && (
        <div className="text-center py-24 glass-card border-dashed">
          <PizzaIcon size={48} className="text-white/10 mx-auto mb-4" />
          <p className="text-xl text-secondary">No items found matching your filters</p>
          <button onClick={() => {setSearchTerm(''); setActiveType('All');}} className="mt-4 text-primary font-bold hover:underline">Clear all filters</button>
        </div>
      )}

      <div className="glass-card p-12 text-center bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
        <PizzaIcon size={64} className="text-primary mx-auto mb-6" />
        <h3 className="text-2xl font-extrabold mb-4">Want to create your own?</h3>
        <p className="text-secondary mb-8 max-w-md mx-auto">Use our interactive builder to craft a pizza that’s uniquely yours with any toppings you desire.</p>
        <Link to="/builder" className="btn-primary py-4 px-10 text-lg shadow-xl shadow-primary/20">Go to Pizza Builder</Link>
      </div>
    </div>
  );
};

export default Menu;


