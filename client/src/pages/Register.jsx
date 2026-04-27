import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../store/slices/authSlice';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, isSuccess, isLoading, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) Swal.fire('Error', message, 'error');
    if (isSuccess) {
      Swal.fire('Success', 'Verification email sent. Please check your inbox.', 'success');
      navigate('/login');
    }
    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  return (
    <div className="auth-page-wrapper">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="auth-card"
      >
        <h2 className="text-3xl font-bold mb-6 title-gradient">Create Account</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-secondary text-sm">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="John Doe" required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-secondary text-sm">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={onChange} placeholder="john@example.com" required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-secondary text-sm">Password</label>
            <input type="password" name="password" value={formData.password} onChange={onChange} placeholder="••••••••" required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-secondary text-sm">Account Type</label>
            <select name="role" value={formData.role} onChange={onChange}>
              <option value="user">Customer</option>
              <option value="admin">Restaurant Admin</option>
            </select>
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 text-lg">
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <div className="mt-6 text-center text-secondary text-sm">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
