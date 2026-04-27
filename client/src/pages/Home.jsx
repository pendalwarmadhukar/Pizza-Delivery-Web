import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, Flame, Clock, Truck, ChefHat, ArrowRight, Sparkles, MapPin, Phone, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import '../styles/Home.css';
import vegIcon from '../assets/veg.svg';
import nonVegIcon from '../assets/non-veg.svg';

const Home = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({}); // { [pizza._id]: quantity }
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/pizza');
        setPizzas(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPizzas();
  }, []);

  const handleAddToCart = (pizza) => {
    setCart(prev => ({ ...prev, [pizza._id]: (prev[pizza._id] || 0) + 1 }));
  };

  const handleRemoveFromCart = (pizzaId) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[pizzaId] > 1) {
        newCart[pizzaId] -= 1;
      } else {
        delete newCart[pizzaId];
      }
      return newCart;
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((total, [id, qty]) => {
    const pizza = pizzas.find(p => p._id === id);
    return total + (pizza ? pizza.price * qty : 0);
  }, 0);

  const handleCheckoutCart = async () => {
    if (!user) {
      return navigate('/login');
    }

    const { value: deliveryAddress } = await Swal.fire({
      title: 'Delivery Address',
      input: 'textarea',
      inputLabel: 'Where should we deliver your pizza?',
      inputPlaceholder: 'Enter your full address here...',
      inputAttributes: {
        'aria-label': 'Enter your full address'
      },
      showCancelButton: true,
      confirmButtonColor: '#FF4D00',
      inputValidator: (value) => {
        if (!value) {
          return 'Address is required for delivery!'
        }
      }
    });

    if (!deliveryAddress) return;

    try {
      // Step 1: Create order on backend
      const orderItems = Object.entries(cart).map(([id, qty]) => {
        const pizza = pizzas.find(p => p._id === id);
        return {
          name: `${qty}x ${pizza.name}`,
          price: pizza.price * qty,
          isCustom: false,
          config: null,
          quantity: qty
        };
      });

      const orderData = {
        items: orderItems,
        totalAmount: totalPrice,
        deliveryAddress
      };

      const { data } = await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      // Step 2: Fetch Razorpay Key
      const { data: configData } = await axios.get('http://localhost:5000/api/config/razorpay-key');

      // Step 3: Open Razorpay Checkout
      const options = {
        key: configData.key,
        amount: data.rzpOrder.amount,
        currency: "INR",
        name: "Pizza Hub",
        description: `Order for ${totalItems} items`,
        order_id: data.rzpOrder.id,
        handler: async (response) => {
          try {
            await axios.post('http://localhost:5000/api/orders/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: data.orderId
            }, {
              headers: { Authorization: `Bearer ${user.token}` }
            });

            Swal.fire({
              icon: 'success',
              title: '🍕 Order Placed!',
              text: 'Your pizzas are being prepared. Track them in your orders!',
              confirmButtonColor: '#E53935',
            });
            setCart({}); // Clear cart on success
            navigate('/my-orders');
          } catch (err) {
            Swal.fire('Error', 'Payment verification failed. Please contact support.', 'error');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#E53935"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        Swal.fire('Payment Failed', response.error.description || 'Something went wrong', 'error');
      });
      rzp.open();

    } catch (err) {
      console.error('Order Error:', err);
      Swal.fire('Error', err.response?.data?.message || 'Failed to create order. Please try again.', 'error');
    }
  };

  return (
    <div className="restaurant-home" style={{ paddingBottom: totalItems > 0 ? '120px' : '0' }}>
      {/* ===== PREMIUM HERO SECTION ===== */}
      <section className="premium-hero">
        <div className="premium-hero-bg">
          <img src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=2000" alt="Wood fired pizza background" className="hero-bg-img" />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text-center"
          >
            <div className="hero-badge">
              <Flame size={16} className="text-primary" /> 
              <span className="hero-badge-text">Authentic Italian Experience</span>
            </div>
            <h1 className="hero-title">
              Taste The <span className="title-gradient">Tradition</span>
            </h1>
            <p className="hero-desc">
              Handcrafted dough, San Marzano tomatoes, and mozzarella di bufala. Baked to perfection in our 800° wood-fired oven.
            </p>
            <div className="hero-actions">
              <button onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })} className="btn-primary">
                Order Delivery
              </button>
              <button onClick={() => navigate('/builder')} className="btn-outline">
                Build Custom Pizza
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== ABOUT / OUR STORY ===== */}
      <section className="about-section">
        <div className="container">
          <div className="about-grid">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="about-image-wrapper"
            >
              <img src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800" alt="Chef preparing pizza" className="about-image" />
              <div className="about-glow"></div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="about-content"
            >
              <div className="section-subtitle">Our Story</div>
              <h2 className="section-title">The Secret is in <br/><span className="text-muted">the Dough</span></h2>
              <p className="section-desc">
                Since 2010, we've been on a mission to bring authentic Neapolitan pizza to the neighborhood. Our dough is naturally fermented for 72 hours, creating that signature airy, charred crust you love.
              </p>
              <p className="section-desc mb-large">
                We source our ingredients directly from local farmers and select Italian artisans. It's not just pizza; it's a culinary journey.
              </p>
              <div className="stats-container">
                <div className="stat-item">
                  <div className="stat-value">72<span className="text-primary">h</span></div>
                  <div className="stat-label">Fermentation</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">800<span className="text-primary">°</span></div>
                  <div className="stat-label">Wood-Fired</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== MENU SECTION ===== */}
      <section id="menu" className="menu-section">
        <div className="container">
          <div className="menu-header">
            <div className="section-subtitle">Handcrafted</div>
            <h2 className="section-title text-center">Wood-Fired <span className="title-gradient">Specials</span></h2>
            <p className="section-desc text-center">Taste The Tradition in every slice, baked to perfection in our 800° oven.</p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Firing up the oven...</p>
            </div>
          ) : (
            <div className="pizza-grid">
              {pizzas.map((pizza, index) => {
                const quantity = cart[pizza._id] || 0;
                
                return (
                  <motion.div
                    key={pizza._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="pizza-card"
                  >
                    <div className="card-img-wrapper">
                      <img src={pizza.image} alt={pizza.name} className="card-img" />
                      <div className="type-badge">
                        {(!pizza.type || pizza.type === 'Veg') ? (
                          <img src={vegIcon} alt="Veg" style={{ width: '14px', height: '14px' }} />
                        ) : (
                          <img src={nonVegIcon} alt="Non-Veg" style={{ width: '14px', height: '14px' }} />
                        )}
                        <span className="type-text">{pizza.type || 'Veg'}</span>
                      </div>
                      <div className="price-tag">
                        ₹{pizza.price}
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="card-header">
                        <h3 className="card-title">{pizza.name}</h3>
                        <div className="card-rating">
                          <Star size={12} fill="currentColor" /> 4.8
                        </div>
                      </div>
                      <p className="card-desc">
                        {pizza.description}
                      </p>
                      
                      {quantity > 0 ? (
                        <div className="cart-controls">
                          <button onClick={() => handleRemoveFromCart(pizza._id)} className="qty-btn">
                            <Minus size={18} />
                          </button>
                          <span className="qty-value">{quantity}</span>
                          <button onClick={() => handleAddToCart(pizza)} className="qty-btn btn-primary-small">
                            <Plus size={18} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => handleAddToCart(pizza)} className="btn-primary btn-full">
                          <ShoppingCart size={18} /> Add to Cart
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="testimonials-section">
        <div className="container text-center">
          <div className="section-subtitle">Reviews</div>
          <h2 className="section-title text-center mb-large">What Our Guests Say</h2>
          
          <div className="testimonials-grid">
            {[
              { text: "Hands down the best Margherita in the city. The crust is unbelievable, exactly like the ones I had in Naples.", author: "Sarah Jenkins" },
              { text: "Fast delivery, and the pizza arrives hot and fresh. The truffle mushroom pizza is a masterpiece.", author: "David Chen" },
              { text: "I love the custom pizza builder! Always perfectly baked and the ingredients are super premium.", author: "Michael Rossi" }
            ].map((review, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="testimonial-card"
              >
                <div className="testimonial-quote">"</div>
                <div className="stars-container">
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                </div>
                <p className="testimonial-text">{review.text}</p>
                <div className="testimonial-author">{review.author}</div>
                <div className="testimonial-verified">Verified Customer</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FLOATING CART CHECKOUT ===== */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="floating-cart"
          >
            <div className="container floating-cart-inner">
              <div className="cart-info">
                <div className="cart-items-count">
                  {totalItems} Item{totalItems > 1 ? 's' : ''} in your cart
                </div>
                <div className="cart-total">
                  Total: <span className="text-primary">₹{totalPrice}</span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckoutCart} 
                className="btn-primary checkout-btn"
              >
                Checkout Now <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;


