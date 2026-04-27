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
    <div className="restaurant-home" style={{ paddingBottom: totalItems > 0 ? '120px' : '0' }}>
      {/* ===== PREMIUM HERO SECTION ===== */}
      <section className="premium-hero">
        <div className="premium-hero-bg">
          <img src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=2000" alt="Wood fired pizza background" className="hero-bg-img" />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content relative z-10 text-center flex flex-col items-center justify-center h-full pt-20 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text-center"
          >
            <div className="hero-badge bg-black/60 border border-white/10 backdrop-blur-md px-6 py-2 rounded-full mb-6 inline-flex items-center gap-3">
              <Flame size={16} className="text-primary" /> 
              <span className="text-xs font-bold tracking-widest uppercase">Authentic Italian Experience</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
              Taste The <span className="title-gradient">Tradition</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              Handcrafted dough, San Marzano tomatoes, and mozzarella di bufala. Baked to perfection in our 800° wood-fired oven.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })} className="btn-primary btn-lg shadow-2xl shadow-primary/20">
                Order Delivery
              </button>
              <button onClick={() => navigate('/builder')} className="btn-outline btn-lg bg-white text-black border-none hover:bg-white/90">
                Build Custom Pizza
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== ABOUT / OUR STORY ===== */}
      <section className="about-section py-24 bg-[#0a0a0c]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800" alt="Chef preparing pizza" className="rounded-3xl relative z-10 shadow-2xl w-full" />
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-primary/20 rounded-full blur-[60px] z-0"></div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="text-primary font-bold uppercase tracking-widest text-sm">Our Story</div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">The Secret is in <br/><span className="text-white/40">the Dough</span></h2>
              <p className="text-secondary text-lg leading-relaxed">
                Since 2010, we've been on a mission to bring authentic Neapolitan pizza to the neighborhood. Our dough is naturally fermented for 72 hours, creating that signature airy, charred crust you love.
              </p>
              <p className="text-secondary text-lg mb-8 leading-relaxed">
                We source our ingredients directly from local farmers and select Italian artisans. It's not just pizza; it's a culinary journey.
              </p>
              <div className="flex gap-12 pt-8 border-t border-white/5">
                <div>
                  <div className="text-3xl font-bold text-white mb-1">72<span className="text-primary">h</span></div>
                  <div className="text-xs text-secondary uppercase font-bold tracking-widest">Fermentation</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">800<span className="text-primary">°</span></div>
                  <div className="text-xs text-secondary uppercase font-bold tracking-widest">Wood-Fired</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== MENU SECTION ===== */}
      <section id="menu" className="menu-section py-24 bg-[#111114]">
        <div className="container">
          <div className="text-center mb-16">
            <div className="text-primary font-bold uppercase tracking-widest text-sm mb-4">Our Menu</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Wood-Fired <span className="text-white/40">Specials</span></h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="loading-spinner"></div>
              <p className="text-xl font-medium text-secondary">Firing up the oven...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {pizzas.map((pizza, index) => {
                const quantity = cart[pizza._id] || 0;
                
                return (
                  <motion.div
                    key={pizza._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="pizza-card glass-card overflow-hidden"
                  >
                    <div className="h-64 relative overflow-hidden group">
                      <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                      <div className="absolute top-4 right-4 bg-primary text-white font-bold px-4 py-2 rounded-xl shadow-lg">
                        ₹{pizza.price}
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold">{pizza.name}</h3>
                        <div className="flex items-center gap-1 text-xs font-bold bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-md">
                          <Star size={12} fill="currentColor" /> 4.8
                        </div>
                      </div>
                      <p className="text-secondary text-sm mb-8 line-clamp-2 h-10">
                        {pizza.description}
                      </p>
                      
                      {quantity > 0 ? (
                        <div className="flex items-center justify-between bg-white/5 rounded-2xl p-2">
                          <button onClick={() => handleRemoveFromCart(pizza._id)} className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl text-white transition">
                            <Minus size={18} />
                          </button>
                          <span className="font-bold text-2xl text-white">{quantity}</span>
                          <button onClick={() => handleAddToCart(pizza)} className="w-12 h-12 flex items-center justify-center bg-primary hover:bg-primary-hover rounded-xl text-white transition shadow-xl shadow-primary/20">
                            <Plus size={18} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => handleAddToCart(pizza)} className="btn-primary w-full py-4 rounded-2xl">
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
      <section className="testimonials-section py-24 bg-[#0a0a0c]">
        <div className="container text-center">
          <div className="text-primary font-bold uppercase tracking-widest text-sm mb-4">Reviews</div>
          <h2 className="text-4xl font-bold text-white mb-16">What Our Guests Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                className="glass-card p-10 text-left relative"
              >
                <div className="text-primary opacity-20 absolute top-4 left-6 text-6xl font-serif">"</div>
                <div className="flex mb-6 gap-1 text-yellow-500">
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                </div>
                <p className="mb-8 relative z-10 text-lg text-white/80 italic leading-relaxed">{review.text}</p>
                <div className="font-bold text-white mb-1">{review.author}</div>
                <div className="text-xs text-secondary uppercase tracking-widest">Verified Customer</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="site-footer bg-[#050505] pt-24 pb-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
            <div className="max-w-xs">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Flame className="text-primary" /> Pizza Hub
              </h3>
              <p className="text-secondary leading-relaxed mb-8">
                Bringing the authentic taste of Italy right to your doorstep. Baked with love, delivered with speed.
              </p>
              <div className="flex gap-4">
                {['FB', 'IG', 'TW'].map(social => (
                  <div key={social} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-primary transition-colors cursor-pointer rounded-full text-white font-bold text-xs">
                    {social}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-white font-bold text-lg uppercase tracking-widest">Contact Us</h4>
              <ul className="space-y-4 text-secondary">
                <li className="flex items-start gap-4">
                  <MapPin size={20} className="text-primary shrink-0 mt-1" />
                  <span>42 Pizza Street, Bandra West,<br/>Mumbai, Maharashtra 400050</span>
                </li>
                <li className="flex items-center gap-4">
                  <Phone size={20} className="text-primary shrink-0" />
                  <span>+91 98765 43210</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-white font-bold text-lg uppercase tracking-widest">Opening Hours</h4>
              <ul className="space-y-4 text-secondary">
                <li className="flex justify-between pb-3 border-b border-white/5">
                  <span className="font-medium">Mon - Thu:</span> <span className="text-white">11 AM - 10 PM</span>
                </li>
                <li className="flex justify-between pb-3 border-b border-white/5">
                  <span className="font-medium">Fri - Sat:</span> <span className="text-white">11 AM - 12 AM</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Sunday:</span> <span className="text-white">12 PM - 10 PM</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 text-center text-secondary text-sm">
            <p>© {new Date().getFullYear()} Pizza Hub. Built with passion for pizza lovers.</p>
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
            className="fixed bottom-0 left-0 w-full bg-dark/80 backdrop-blur-xl border-t border-white/10 p-6 z-[60] shadow-2xl"
          >
            <div className="container flex justify-between items-center gap-4">
              <div>
                <div className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
                  {totalItems} Item{totalItems > 1 ? 's' : ''} in your cart
                </div>
                <div className="text-3xl font-extrabold text-white">
                  Total: <span className="text-primary">₹{totalPrice}</span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckoutCart} 
                className="btn-primary py-4 px-10 rounded-2xl text-lg shadow-2xl shadow-primary/30 flex items-center gap-3"
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

