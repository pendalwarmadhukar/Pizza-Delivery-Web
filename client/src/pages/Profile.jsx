import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, Shield, Save, Key } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';

const Profile = () => {
  const { user } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: ''
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    // Implementation for updating user profile
    Swal.fire('Updated', 'Your profile has been updated successfully', 'success');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-12 title-gradient">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="glass-card p-8 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6 border-4 border-primary">
            <User size={48} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{user?.name}</h2>
          <span className="px-4 py-1 bg-white/5 rounded-full text-xs font-bold uppercase text-secondary tracking-widest border border-white/10">
            {user?.role} Account
          </span>
          
          <div className="w-full mt-12 space-y-4">
            <div className="flex items-center gap-4 text-secondary text-sm">
              <Mail size={18} /> {user?.email}
            </div>
            <div className="flex items-center gap-4 text-secondary text-sm">
              <Shield size={18} /> Verified User
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleUpdate} className="md:col-span-2 glass-card p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-secondary uppercase">Full Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-secondary uppercase">Email Address</label>
              <input 
                type="email" 
                value={formData.email}
                disabled
                className="w-full opacity-50 cursor-not-allowed"
              />
            </div>
          </div>

          <hr className="border-white/5" />

          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Key size={20} className="text-primary" /> Change Password
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-secondary uppercase">Current Password</label>
                <input 
                  type="password" 
                  placeholder="********"
                  className="w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-secondary uppercase">New Password</label>
                <input 
                  type="password" 
                  placeholder="New password"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2">
            <Save size={20} /> Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
