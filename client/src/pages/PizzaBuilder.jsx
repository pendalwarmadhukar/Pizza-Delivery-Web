import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { fetchInventory, setBase, setSauce, setCheese, toggleVeggie, setMeat, resetBuilder } from '../store/slices/builderSlice';
import { createOrder } from '../store/slices/orderSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, ShoppingCart, Pizza } from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const steps = ['Base', 'Sauce', 'Cheese', 'Veggies', 'Meat'];

const PizzaBuilder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [address, setAddress] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { inventory, selectedBase, selectedSauce, selectedCheese, selectedVeggies, selectedMeat, totalPrice, isLoading } = useSelector(state => state.builder);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const items = inventory.filter(item => item.category === steps[currentStep]);

  const handleNext = () => {
    if (currentStep === 0 && !selectedBase) return Swal.fire('Error', 'Please select a base', 'warning');
    if (currentStep === 1 && !selectedSauce) return Swal.fire('Error', 'Please select a sauce', 'warning');
    if (currentStep === 2 && !selectedCheese) return Swal.fire('Error', 'Please select a cheese type', 'warning');
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handlePlaceOrder = async () => {
    if (!user) return navigate('/login');
    if (!selectedBase || !selectedSauce || !selectedCheese) {
      return Swal.fire('Incomplete', 'Please complete all required steps (Base, Sauce, Cheese)', 'warning');
    }
    if (!address.trim()) {
      return Swal.fire('Address Missing', 'Please enter a delivery address', 'warning');
    }
    if (totalPrice === 0) return Swal.fire('Error', 'Your cart is empty', 'warning');

    try {
      // Step 1: Create order on backend
      const orderData = {
        items: [{
          name: 'Custom Pizza',
          price: totalPrice,
          isCustom: true,
          config: {
            base: selectedBase.name,
            sauce: selectedSauce.name,
            cheese: selectedCheese.name,
            veggies: selectedVeggies.map(v => v.name),
            meat: selectedMeat?.name || null
          }
        }],
        totalAmount: totalPrice,
        deliveryAddress: address
      };


      const { data } = await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      // Step 2: Fetch Razorpay Key from server
      const { data: configData } = await axios.get('http://localhost:5000/api/config/razorpay-key');

      // Step 3: Open Razorpay Checkout
      const options = {
        key: configData.key,
        amount: data.rzpOrder.amount,
        currency: "INR",
        name: "Pizza Hub",
        description: "Custom Pizza Order",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=100",
        order_id: data.rzpOrder.id,
        handler: async (response) => {
          try {
            // Step 4: Verify payment on server
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
              text: 'Your custom pizza is being prepared. Track it in your orders!',
              confirmButtonColor: '#FF4D00',
            });
            dispatch(resetBuilder());
            navigate('/my-orders');
          } catch (err) {
            Swal.fire('Error', 'Payment verification failed. Please contact support.', 'error');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        notes: {
          order_type: 'custom_pizza',
        },
        theme: {
          color: "#FF4D00"
        },
        modal: {
          ondismiss: () => {
            Swal.fire('Cancelled', 'Payment was cancelled. Your order was not placed.', 'info');
          }
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
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 title-gradient">Custom Pizza Builder</h1>
      
      <div className="flex gap-8 items-start">
        {/* Left: Component Selection */}
        <div className="flex-1">
          <div className="flex justify-between mb-8 overflow-x-auto gap-4 pb-4">
            {steps.map((step, idx) => (
              <div 
                key={step}
                className={`flex-1 min-w-[100px] text-center p-3 rounded-xl border transition-all ${idx <= currentStep ? 'border-primary text-primary bg-primary/10' : 'border-white/10 text-secondary'}`}
              >
                <div className="text-xs uppercase font-bold mb-1">Step {idx + 1}</div>
                <div className="font-semibold">{step}</div>
              </div>
            ))}
          </div>

          <motion.div 
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {items.map(item => {
              const isSelected = selectedBase?.name === item.name || 
                                selectedSauce?.name === item.name || 
                                selectedCheese?.name === item.name || 
                                selectedMeat?.name === item.name ||
                                selectedVeggies.find(v => v.name === item.name);
              
              return (
                <button
                  key={item._id}
                  onClick={() => {
                    if (currentStep === 0) dispatch(setBase(item));
                    if (currentStep === 1) dispatch(setSauce(item));
                    if (currentStep === 2) dispatch(setCheese(item));
                    if (currentStep === 3) dispatch(toggleVeggie(item));
                    if (currentStep === 4) dispatch(setMeat(item));
                  }}
                  className={`p-6 rounded-2xl glass-card text-left transition-all ${isSelected ? 'border-primary shadow-[0_0_15px_rgba(255,77,0,0.2)]' : 'hover:border-white/20'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-bold text-lg">{item.name}</span>
                    {isSelected && <Check className="text-primary" size={20} />}
                  </div>
                  <div className="text-primary font-bold">₹{item.price}</div>
                  <div className="text-secondary text-xs mt-1">{item.quantity} in stock</div>
                </button>
              );
            })}
          </motion.div>

          <div className="flex justify-between mt-12">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 text-secondary hover:text-white"
            >
              <ChevronLeft size={20} /> Back
            </button>
            
            {currentStep === steps.length - 1 ? (
              <button onClick={handlePlaceOrder} className="btn-primary py-4 px-8 text-lg flex items-center gap-2">
                <ShoppingCart size={22} /> Checkout - ₹{totalPrice}
              </button>
            ) : (
              <button onClick={handleNext} className="btn-primary flex items-center gap-2">
                Next <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Right: Summary Card */}
        <div className="w-80 glass-card p-6 sticky top-28">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Pizza className="text-primary" size={24} /> Your Build
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-secondary">Base:</span>
              <span className="font-medium">{selectedBase?.name || '---'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-secondary">Sauce:</span>
              <span className="font-medium">{selectedSauce?.name || '---'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-secondary">Cheese:</span>
              <span className="font-medium">{selectedCheese?.name || '---'}</span>
            </div>
            <div className="py-2 border-b border-white/5">
              <span className="text-secondary block mb-1">Veggies:</span>
              <div className="flex flex-wrap gap-1">
                {selectedVeggies.map(v => (
                  <span key={v.name} className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-[10px]">{v.name}</span>
                ))}
                {selectedVeggies.length === 0 && <span className="text-white/20">None selected</span>}
              </div>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-secondary">Meat:</span>
              <span className="font-medium">{selectedMeat?.name || 'None'}</span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <label className="text-secondary text-sm font-bold uppercase tracking-widest block">Delivery Address</label>
            <textarea 
              placeholder="House No, Street, Landmark..."
              className="w-full glass-card bg-white/5 border-white/10 rounded-xl p-3 text-sm focus:border-primary outline-none min-h-[100px] transition"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-bold text-primary">₹{totalPrice}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PizzaBuilder;
