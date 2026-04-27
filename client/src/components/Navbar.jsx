import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { Pizza, ShoppingBag, User, LogOut, Settings, MapPin } from 'lucide-react';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [address, setAddress] = useState(() => localStorage.getItem('deliveryLocation') || 'Detecting location...');

  useEffect(() => {
    if (!localStorage.getItem('deliveryLocation')) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await res.json();
              const city = data.address.city || data.address.town || data.address.village || '';
              const area = data.address.suburb || data.address.neighbourhood || '';
              const foundLocation = area ? `${area}, ${city}` : city || 'Location found';
              setAddress(foundLocation);
              localStorage.setItem('deliveryLocation', foundLocation);
            } catch {
              setAddress('Click to add location');
            }
          },
          () => setAddress('Click to add location'),
          { enableHighAccuracy: true }
        );
      } else {
        setAddress('Click to add location');
      }
    }
  }, []);

  const handleUpdateLocation = async () => {
    // Dynamically import Swal to avoid issues if it's not at the top, but it should be imported.
    const Swal = (await import('sweetalert2')).default;
    const { value: newLocation } = await Swal.fire({
      title: 'Update Delivery Location',
      input: 'text',
      inputLabel: 'Enter your full address or area',
      inputValue: address !== 'Detecting location...' && address !== 'Click to add location' ? address : '',
      showCancelButton: true,
      confirmButtonText: 'Save Location',
      confirmButtonColor: 'var(--primary)',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
      }
    });

    if (newLocation) {
      setAddress(newLocation);
      localStorage.setItem('deliveryLocation', newLocation);
      Swal.fire({
        title: 'Location Updated!',
        text: `We will deliver to: ${newLocation}`,
        icon: 'success',
        confirmButtonColor: 'var(--primary)',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="navbar-logo-icon">🍕</span>
        <span className="navbar-logo-text">Pizza Hub</span>
      </Link>

      {/* Location */}
      <div className="navbar-location" onClick={handleUpdateLocation} title="Click to change your delivery address">
        <MapPin size={16} className="text-primary" />
        <div>
          <div className="navbar-location-label">Deliver to</div>
          <div className="navbar-location-address">{address}</div>
        </div>
      </div>

      {/* Nav Links */}
      <div className="navbar-links">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Menu</Link>
        <Link to="/builder" className={`nav-link ${isActive('/builder') ? 'active' : ''}`}>Builder</Link>
        
        {user ? (
          <>
            {user.role === 'admin' ? (
              <Link to="/admin" className={`nav-link flex items-center gap-1 ${isActive('/admin') ? 'active' : ''}`}>
                <Settings size={18} /> Admin
              </Link>
            ) : (
              <Link to="/my-orders" className={`nav-link flex items-center gap-1 ${isActive('/my-orders') ? 'active' : ''}`}>
                <ShoppingBag size={18} /> My Orders
              </Link>
            )}
            <div className="navbar-user">
              <span className="navbar-user-name">
                <User size={16} /> {user.name}
              </span>
              <button onClick={handleLogout} className="navbar-logout-btn">
                <LogOut size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>Login</Link>
            <Link to="/register" className="btn-primary py-2 px-6">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
