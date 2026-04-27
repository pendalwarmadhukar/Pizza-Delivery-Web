import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { fetchInventory, setBase, setSauce, setCheese, toggleVeggie, setMeat, resetBuilder } from '../store/slices/builderSlice';
import { createOrder } from '../store/slices/orderSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, ShoppingCart, Pizza } from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../styles/PizzaBuilder.css';

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
    <div className="builder-page container">
      <div className="builder-header">
        <h1 className="builder-title title-gradient">Pizza Workshop</h1>
        <p className="builder-subtitle text-secondary">Craft your culinary masterpiece with premium ingredients.</p>
      </div>
      
      <div className="builder-content-flex">
        {/* Left: Component Selection */}
        <div className="builder-main">
          <div className="builder-step-indicator">
            {steps.map((step, idx) => (
              <div 
                key={step}
                className={`step-pill ${idx <= currentStep ? 'active' : ''}`}
              >
                <div className="step-phase">Phase 0{idx + 1}</div>
                <div className="step-name">{step}</div>
              </div>
            ))}
          </div>

          <motion.div 
            key={currentStep}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ingredient-grid"
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
                  className={`ingredient-card ${isSelected ? 'selected' : ''}`}
                >
                  <div className="ingredient-card-header">
                    <div className="ingredient-icon-wrapper">
                        <Pizza size={24} className={isSelected ? 'text-primary' : 'icon-muted'} />
                    </div>
                    {isSelected && <div className="ingredient-check-wrapper"><Check className="text-white" size={14} strokeWidth={4} /></div>}
                  </div>
                  <div className="ingredient-name">{item.name}</div>
                  <div className="ingredient-price text-primary">₹{item.price}</div>
                  <div className="ingredient-stock">{item.quantity} units left</div>
                </button>
              );
            })}
          </motion.div>

          <div className="builder-navigation">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`nav-back-btn ${currentStep === 0 ? 'disabled' : ''}`}
            >
              <ChevronLeft size={20} /> Previous Phase
            </button>
            
            <div className="nav-next-actions">
                 {currentStep < steps.length - 1 && (
                    <button onClick={handleNext} className="btn-primary nav-next-btn group">
                        Next Phase <ChevronRight size={20} className="next-icon-anim" />
                    </button>
                 )}
                 {currentStep === steps.length - 1 && (
                    <button onClick={handlePlaceOrder} className="btn-primary finalize-btn">
                        <ShoppingCart size={22} strokeWidth={3} /> <span>Finalize Build</span>
                    </button>
                 )}
            </div>
          </div>
        </div>

        {/* Right: Summary Card */}
        <div className="builder-summary">
          <h2 className="summary-title">
            <div className="title-dash bg-primary"></div>
            Order Blueprint
          </h2>
          
          <div className="summary-items-list">
            <div className="summary-item">
              <span className="summary-label">Selected Base</span>
              <span className="summary-value">{selectedBase?.name || '---'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Signature Sauce</span>
              <span className="summary-value">{selectedSauce?.name || '---'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Premium Cheese</span>
              <span className="summary-value">{selectedCheese?.name || '---'}</span>
            </div>
            <div className="summary-item-veggies">
              <span className="summary-label">Garden Veggies</span>
              <div className="veggie-tags">
                {selectedVeggies.map(v => (
                  <span key={v.name} className="veggie-tag">{v.name}</span>
                ))}
                {selectedVeggies.length === 0 && <span className="no-veggies">No greens added</span>}
              </div>
            </div>
            <div className="summary-item">
              <span className="summary-label">Choice Meat</span>
              <span className="summary-value">{selectedMeat?.name || 'Vegetarian'}</span>
            </div>
          </div>

          <div className="delivery-section">
            <label className="delivery-label">Delivery Coordinates</label>
            <textarea 
              placeholder="Enter your location details..."
              className="delivery-textarea"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="total-section">
            <div>
                <div className="total-label">Total Premium</div>
                <div className="total-price text-primary">₹{totalPrice}</div>
            </div>
            <div className="tax-label">Inc. Taxes</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PizzaBuilder;
