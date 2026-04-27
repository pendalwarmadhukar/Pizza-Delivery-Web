import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Pizza as PizzaIcon } from 'lucide-react';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const pizzas = products.filter(p => p.category === 'Pizza');
  const sides = products.filter(p => p.category === 'Side');

  return (
    <div className="menu-page animate-fade">
      <h1>Our Kitchen <span className="text-primary">Specials</span></h1>
      <p className="subtitle">Handcrafted dinner options prepared fresh by our chefs.</p>
      
      {pizzas.length > 0 && (
        <div className="menu-category">
          <h2 className="cat-title">Specialty Pizzas</h2>
          <div className="food-grid">
            {pizzas.map(item => (
              <div key={item._id} className="food-card glass-card">
                <div className="food-img-container">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="food-info">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="food-meta">
                    <span className="price">₹{item.price}</span>
                    <Link to="/build" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Order</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sides.length > 0 && (
        <div className="menu-category">
          <h2 className="cat-title">Premium Sides</h2>
          <div className="food-grid">
            {sides.map(item => (
              <div key={item._id} className="food-card glass-card">
                <div className="food-img-container">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="food-info">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="food-meta">
                    <span className="price">₹{item.price}</span>
                    <Link to="/build" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Order</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="menu-footer glass-card text-center">
        <PizzaIcon size={48} color="#ff4d4d" style={{ marginBottom: '1.5rem' }} />
        <h3>Want to create your own?</h3>
        <p>Use our interactive builder to craft a pizza that’s uniquely yours.</p>
        <Link to="/build" className="btn-primary">Go to Pizza Builder</Link>
      </div>
    </div>
  );
};

export default Menu;
