import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Pizza as PizzaIcon, Search, Filter, Leaf, Utensils } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import '../styles/Menu.css';
import vegIcon from '../assets/veg.svg';
import nonVegIcon from '../assets/non-veg.svg';

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
      <div className="menu-page menu-container">
        <div className="skeleton-title"><Skeleton className="w-full h-full" /></div>
        <div className="pizza-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-card menu-skeleton-card">
              <Skeleton className="skeleton-img" />
              <div className="menu-skeleton-content">
                <Skeleton className="skeleton-line title" />
                <Skeleton className="skeleton-line" />
                <Skeleton className="skeleton-line short" />
                <Skeleton className="skeleton-btn" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="menu-page menu-container animate-fade">
      <div className="menu-header-flex">
        <div className="menu-header-text">
          <h1 className="menu-title title-gradient">Our Kitchen Specials</h1>
          <p className="menu-subtitle text-secondary">Handcrafted dinner options prepared fresh by our chefs.</p>
        </div>

        <div className="menu-controls">
          {/* Category Filter */}
          <div className="menu-filters">
            {['All', 'Veg', 'Non-Veg'].map(type => (
              <button 
                key={type}
                onClick={() => setActiveType(type)}
                className={`filter-btn ${activeType === type ? 'active' : ''}`}
              >
                {type === 'Veg' && (
                  <img src={vegIcon} alt="Veg" className="w-3.5 h-3.5" style={{ width: '14px', height: '14px' }} />
                )}
                {type === 'Non-Veg' && (
                  <img src={nonVegIcon} alt="Non-Veg" className="w-3.5 h-3.5" style={{ width: '14px', height: '14px' }} />
                )}
                {type}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="menu-search-wrapper">
            <Search className="search-icon text-secondary" size={20} />
            <input 
              type="text" 
              placeholder="Search for pizzas, sides..." 
              className="menu-search-input glass-card"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {pizzas.length > 0 && (
        <div className="menu-category-section">
          <h2 className="category-title text-primary">
            <div className="title-dash bg-primary"></div> Specialty Pizzas
          </h2>
          <div className="pizza-grid">
            {pizzas.map(item => (
              <div key={item._id} className="food-card glass-card">
                <div className="card-img-wrapper">
                  <img src={item.image} alt={item.name} className="card-img" />
                  <div className="type-badge">
                    {(!item.type || item.type === 'Veg') ? (
                      <img src={vegIcon} alt="Veg" style={{ width: '14px', height: '14px' }} />
                    ) : (
                      <img src={nonVegIcon} alt="Non-Veg" style={{ width: '14px', height: '14px' }} />
                    )}
                    <span className="type-text">{item.type || 'Veg'}</span>
                  </div>
                  <div className="price-tag-menu bg-primary">
                    ₹{item.price}
                  </div>
                </div>
                <div className="menu-card-content">
                  <h3 className="menu-card-title">{item.name}</h3>
                  <p className="menu-card-desc text-secondary">{item.description}</p>
                  <Link to="/builder" className="btn-primary menu-order-btn">
                    <PizzaIcon size={18} /> Order Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sides.length > 0 && (
        <div className="menu-category-section">
          <h2 className="category-title text-secondary">
            <div className="title-dash bg-secondary"></div> Premium Sides
          </h2>
          <div className="pizza-grid">
            {sides.map(item => (
              <div key={item._id} className="food-card glass-card">
                <div className="card-img-wrapper">
                  <img src={item.image} alt={item.name} className="card-img" />
                  <div className="type-badge">
                    {(!item.type || item.type === 'Veg') ? (
                      <img src={vegIcon} alt="Veg" style={{ width: '14px', height: '14px' }} />
                    ) : (
                      <img src={nonVegIcon} alt="Non-Veg" style={{ width: '14px', height: '14px' }} />
                    )}
                    <span className="type-text">{item.type || 'Veg'}</span>
                  </div>
                  <div className="price-tag-menu bg-secondary">
                    ₹{item.price}
                  </div>
                </div>
                <div className="menu-card-content">
                  <h3 className="menu-card-title">{item.name}</h3>
                  <p className="menu-card-desc text-secondary">{item.description}</p>
                  <Link to="/builder" className="btn-primary menu-order-btn">
                    Order Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="no-results glass-card">
          <PizzaIcon size={48} className="no-results-icon" />
          <p className="no-results-text text-secondary">No items found matching your filters</p>
          <button onClick={() => {setSearchTerm(''); setActiveType('All');}} className="clear-filters-btn text-primary">Clear all filters</button>
        </div>
      )}

      <div className="custom-pizza-promo glass-card">
        <PizzaIcon size={64} className="promo-icon text-primary" />
        <h3 className="promo-title">Want to create your own?</h3>
        <p className="promo-desc text-secondary">Use our interactive builder to craft a pizza that’s uniquely yours with any toppings you desire.</p>
        <Link to="/builder" className="btn-primary promo-btn">Go to Pizza Builder</Link>
      </div>
    </div>
  );
};

export default Menu;


