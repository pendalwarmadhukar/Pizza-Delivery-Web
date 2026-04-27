import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../store/slices/authSlice';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      Swal.fire('Error', message, 'error');
      dispatch(reset());
    }
    if (isSuccess || user) {
      navigate('/');
    }
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8"
      >
        <h2 className="text-3xl font-bold mb-6 title-gradient">Welcome Back</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-secondary text-sm">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={onChange} placeholder="Enter your email" required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-secondary text-sm">Password</label>
            <input type="password" name="password" value={formData.password} onChange={onChange} placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 text-lg">
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-6 text-center text-secondary text-sm">
          Don't have an account? <Link to="/register" className="text-primary hover:underline">Sign up</Link>
          <br /><br />
          <Link to="/forgot-password" size={16} className="text-white/60 hover:text-white">Forgot Password?</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
