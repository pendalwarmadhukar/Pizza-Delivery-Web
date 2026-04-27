import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, Flame, Clock, Truck, ChefHat, ArrowRight, Sparkles, MapPin, Phone, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

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

    try {
      // Step 1: Create order on backend
      const orderItems = Object.entries(cart).map(([id, qty]) => {
        const pizza = pizzas.find(p => p._id === id);
        return {
          name: `${qty}x ${pizza.name}`,
          price: pizza.price * qty,
          isCustom: false,
          config: null
        };
      });

      const orderData = {
        items: orderItems,
        totalAmount: totalPrice
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
    <div className="restaurant-home" style={{ paddingBottom: totalItems > 0 ? '100px' : '0' }}>
      {/* ===== PREMIUM HERO SECTION ===== */}
      <section className="premium-hero">
        <div className="premium-hero-bg">
          <img src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=2000" alt="Wood fired pizza background" className="hero-bg-img" />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content relative z-10 text-center flex flex-col items-center justify-center h-full pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text-center"
          >
            <div className="hero-badge" style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
              <Flame size={16} className="text-primary" /> <span style={{ color: 'white', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.75rem' }}>Authentic Italian Experience</span>
            </div>
            <h1 className="hero-title-massive font-bold text-white mb-6" style={{ fontSize: '4.5rem', textShadow: '0 4px 20px rgba(0,0,0,0.5)', lineHeight: 1.1 }}>
              Taste The <span className="text-primary">Tradition</span>
            </h1>
            <p className="hero-subtitle text-xl mx-auto mb-10" style={{ color: 'rgba(255,255,255,0.8)', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              Handcrafted dough, San Marzano tomatoes, and mozzarella di bufala. Baked to perfection in our 800° wood-fired oven.
            </p>
            <div className="hero-actions justify-center gap-6" style={{ display: 'flex', justifyContent: 'center' }}>
              <button onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })} className="btn-primary btn-lg" style={{ borderRadius: '50px', boxShadow: '0 0 30px rgba(229,57,53,0.4)' }}>
                Order Delivery
              </button>
              <button onClick={() => navigate('/builder')} className="btn-outline btn-lg" style={{ borderRadius: '50px', backgroundColor: 'white', color: 'black', border: 'none' }}>
                Build Custom Pizza
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== ABOUT / OUR STORY ===== */}
      <section className="about-section" style={{ padding: '6rem 2rem', backgroundColor: '#0a0a0c' }}>
        <div className="container mx-auto">
          <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800" alt="Chef preparing pizza" className="rounded-2xl" style={{ width: '100%', position: 'relative', zIndex: 10, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} />
              <div style={{ position: 'absolute', bottom: '-2rem', right: '-2rem', width: '12rem', height: '12rem', backgroundColor: 'var(--primary-glow)', borderRadius: '50%', filter: 'blur(40px)', zIndex: 0 }}></div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="text-primary font-bold uppercase" style={{ letterSpacing: '0.1em', fontSize: '0.875rem' }}>Our Story</div>
              <h2 className="text-5xl font-bold" style={{ lineHeight: 1.1 }}>The Secret is in <br/><span style={{ color: 'rgba(255,255,255,0.6)' }}>the Dough</span></h2>
              <p className="text-secondary text-lg" style={{ lineHeight: 1.8 }}>
                Since 2010, we've been on a mission to bring authentic Neapolitan pizza to the neighborhood. Our dough is naturally fermented for 72 hours, creating that signature airy, charred crust you love.
              </p>
              <p className="text-secondary text-lg mb-8" style={{ lineHeight: 1.8 }}>
                We source our ingredients directly from local farmers and select Italian artisans. It's not just pizza; it's a culinary journey.
              </p>
              <div className="flex gap-10 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">72<span className="text-primary">h</span></div>
                  <div className="text-sm text-secondary">Dough Fermentation</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">800<span className="text-primary">°</span></div>
                  <div className="text-sm text-secondary">Wood-Fired Oven</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== MENU SECTION ===== */}
      <section id="menu" className="menu-section" style={{ padding: '6rem 2rem', backgroundColor: '#111114' }}>
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="text-primary font-bold uppercase mb-3" style={{ letterSpacing: '0.1em', fontSize: '0.875rem' }}>Our Menu</div>
            <h2 className="text-5xl font-bold text-white mb-4">Wood-Fired <span style={{ color: 'rgba(255,255,255,0.5)' }}>Specials</span></h2>
            <div style={{ width: '6rem', height: '4px', backgroundColor: 'var(--primary)', margin: '0 auto', borderRadius: '4px' }}></div>
          </div>

          {loading ? (
            <div className="loading-state py-20">
              <div className="loading-spinner"></div>
              <p className="mt-4 text-xl font-medium">Firing up the oven...</p>
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
                    style={{ backgroundColor: '#18181c' }}
                  >
                    <div className="pizza-card-img" style={{ height: '250px' }}>
                      <img src={pizza.image} alt={pizza.name} />
                      <div className="pizza-card-badge" style={{ bottom: '16px', top: 'auto', backgroundColor: 'var(--primary)', color: 'white', fontSize: '1rem', padding: '8px 16px' }}>
                        ₹{pizza.price}
                      </div>
                    </div>
                    <div className="pizza-card-body">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="pizza-card-title">{pizza.name}</h3>
                        <div className="flex items-center gap-1 text-xs font-bold" style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '4px 8px', borderRadius: '4px' }}>
                          <Star size={12} fill="currentColor" /> 4.8
                        </div>
                      </div>
                      <p className="pizza-card-desc" style={{ height: '3rem' }}>
                        {pizza.description}
                      </p>
                      
                      {quantity > 0 ? (
                        <div className="flex items-center justify-between mt-4" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '8px' }}>
                          <button onClick={() => handleRemoveFromCart(pizza._id)} className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg text-white transition">
                            <Minus size={18} />
                          </button>
                          <span className="font-bold text-xl text-white">{quantity}</span>
                          <button onClick={() => handleAddToCart(pizza)} className="w-10 h-10 flex items-center justify-center bg-primary hover:bg-primary-hover rounded-lg text-white transition shadow-[0_0_15px_rgba(229,57,53,0.4)]">
                            <Plus size={18} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => handleAddToCart(pizza)} className="btn-primary w-full mt-4" style={{ justifyContent: 'center' }}>
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
      <section className="testimonials-section" style={{ padding: '6rem 2rem', backgroundColor: '#0a0a0c' }}>
        <div className="container mx-auto text-center">
          <div className="text-primary font-bold uppercase mb-3" style={{ letterSpacing: '0.1em', fontSize: '0.875rem' }}>Reviews</div>
          <h2 className="text-4xl font-bold text-white mb-12">What Our Guests Say</h2>
          
          <div className="grid grid-cols-3 gap-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
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
                className="glass-card p-8"
                style={{ backgroundColor: '#111114', position: 'relative' }}
              >
                <div style={{ color: 'var(--primary)', opacity: 0.2, position: 'absolute', top: '1rem', left: '1.5rem', fontSize: '4rem', fontFamily: 'serif' }}>"</div>
                <div className="flex justify-center mb-6 mt-4 gap-1" style={{ color: '#f59e0b' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                </div>
                <p className="mb-6 relative z-10 text-lg" style={{ color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', lineHeight: 1.8 }}>{review.text}</p>
                <div className="font-bold text-white">{review.author}</div>
                <div className="text-xs text-secondary mt-1">Verified Customer</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LOCATION & FOOTER ===== */}
      <footer className="site-footer" style={{ borderTop: 'none', backgroundColor: '#050505', paddingTop: '4rem' }}>
        <div className="container mx-auto">
          <div className="footer-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
            <div style={{ gridColumn: '1 / -1', maxWidth: '400px' }}>
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Flame className="text-primary" /> Pizza Hub
              </h3>
              <p className="text-secondary leading-relaxed mb-6">
                Bringing the authentic taste of Italy right to your doorstep. Baked with love, delivered with speed.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center justify-center transition" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer' }}>FB</div>
                <div className="flex items-center justify-center transition" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer' }}>IG</div>
                <div className="flex items-center justify-center transition" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer' }}>TW</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 text-lg">Contact Us</h4>
              <ul className="space-y-4 text-secondary">
                <li className="flex items-start gap-3">
                  <MapPin size={20} className="text-primary" style={{ flexShrink: 0, marginTop: '4px' }} />
                  <span>42 Pizza Street, Bandra West,<br/>Mumbai, Maharashtra 400050</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={20} className="text-primary" style={{ flexShrink: 0 }} />
                  <span>+91 98765 43210</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 text-lg">Opening Hours</h4>
              <ul className="space-y-3 text-secondary">
                <li className="flex justify-between pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span>Mon - Thu:</span> <span className="text-white">11:00 AM - 10:00 PM</span>
                </li>
                <li className="flex justify-between pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span>Fri - Sat:</span> <span className="text-white">11:00 AM - 12:00 AM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday:</span> <span className="text-white">12:00 PM - 10:00 PM</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Pizza Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ===== FLOATING CART CHECKOUT ===== */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            style={{ 
              position: 'fixed', bottom: 0, left: 0, width: '100%', 
              backgroundColor: '#111114', borderTop: '1px solid rgba(255,255,255,0.1)', 
              padding: '1.5rem 2rem', zIndex: 100, boxShadow: '0 -10px 40px rgba(0,0,0,0.5)' 
            }}
          >
            <div className="container mx-auto flex justify-between items-center">
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>
                  {totalItems} Item{totalItems > 1 ? 's' : ''} in Cart
                </div>
                <div className="text-white font-bold" style={{ fontSize: '1.75rem', lineHeight: 1 }}>
                  Total: <span className="text-primary">₹{totalPrice}</span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckoutCart} 
                className="btn-primary" 
                style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '50px', boxShadow: '0 0 20px rgba(229,57,53,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Proceed to Payment <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;

