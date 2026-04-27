import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { Pizza, ShoppingBag, User, LogOut, Settings, MapPin, Menu, X } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [address, setAddress] = useState(() => localStorage.getItem('deliveryLocation') || 'Detecting location...');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const detectLocation = () => {
    setAddress('Detecting location...');
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
  };

  useEffect(() => {
    if (!localStorage.getItem('deliveryLocation')) {
      detectLocation();
    }
  }, []);

  const handleUpdateLocation = async () => {
    const Swal = (await import('sweetalert2')).default;
    const result = await Swal.fire({
      title: 'Update Delivery Location',
      input: 'text',
      inputLabel: 'Enter your full address or area',
      inputValue: address !== 'Detecting location...' && address !== 'Click to add location' ? address : '',
      showCancelButton: true,
      showDenyButton: true,
      denyButtonText: '📍 Detect Current Location',
      denyButtonColor: '#2a2a2d',
      confirmButtonText: 'Save Location',
      confirmButtonColor: 'var(--primary)',
      inputValidator: (value) => {
        // Only require input if they didn't click Deny
        if (!value && !Swal.getDenyButton().matches(':active')) {
          return 'You need to write something!';
        }
      }
    });

    if (result.isDenied) {
      detectLocation();
      Swal.fire({
        title: 'Detecting Location...',
        text: 'Please allow location access in your browser.',
        icon: 'info',
        timer: 2000,
        showConfirmButton: false
      });
    } else if (result.isConfirmed && result.value) {
      setAddress(result.value);
      localStorage.setItem('deliveryLocation', result.value);
      Swal.fire({
        title: 'Location Updated!',
        text: `We will deliver to: ${result.value}`,
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
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="navbar-logo-icon">🍕</span>
        <span className="navbar-logo-text">Pizza Hub</span>
      </Link>

      {/* Desktop Center Links */}
      <div className="navbar-links desktop-only">
        <Link to="/menu" className={`nav-link ${isActive('/menu') ? 'active' : ''}`}>Menu</Link>
        <Link to="/builder" className={`nav-link ${isActive('/builder') ? 'active' : ''}`}>Workshop</Link>
        {user && user.role === 'admin' && (
          <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>Admin</Link>
        )}
      </div>

      {/* Right Actions: Location + User */}
      <div className="navbar-user-actions desktop-only">
        <div className="navbar-location" onClick={handleUpdateLocation}>
          <MapPin size={16} className="text-primary" />
          <span className="navbar-location-address">{address}</span>
        </div>

        {user ? (
          <div className="navbar-auth-links">
            <Link to="/my-orders" className={`nav-icon-link ${isActive('/my-orders') ? 'active' : ''}`}>
              <ShoppingBag size={20} />
            </Link>
            <button onClick={handleLogout} className="nav-logout-btn">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn-primary nav-login-btn">Login</Link>
        )}
      </div>

      {/* Mobile Trigger */}
      <div className="mobile-menu-trigger">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mobile-toggle-btn">
          {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div className={`mobile-overlay ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)}>
        <div className={`mobile-sidebar ${isMenuOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="mobile-sidebar-header">
            <span className="mobile-sidebar-title">Menu</span>
            <button onClick={() => setIsMenuOpen(false)} className="mobile-close-btn"><X size={28} /></button>
          </div>

          <div className="mobile-sidebar-content">
            <Link to="/menu" onClick={() => setIsMenuOpen(false)} className={`mobile-link ${isActive('/menu') ? 'active' : ''}`}>
              <Pizza size={24} /> Menu
            </Link>
            <Link to="/builder" onClick={() => setIsMenuOpen(false)} className={`mobile-link ${isActive('/builder') ? 'active' : ''}`}>
              <Settings size={24} /> Builder
            </Link>
            
            <hr className="mobile-divider" />

            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="mobile-link">
                    <Settings size={24} /> Admin Dashboard
                  </Link>
                ) : (
                  <Link to="/my-orders" onClick={() => setIsMenuOpen(false)} className="mobile-link">
                    <ShoppingBag size={24} /> My Orders
                  </Link>
                )}
                <div className="mobile-user-section">
                  <div className="mobile-user-info">
                    <User size={24} /> {user.name}
                  </div>
                  <button onClick={handleLogout} className="btn-primary mobile-logout-btn">
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="mobile-auth-actions">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn-secondary mobile-auth-btn">Login</Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn-primary mobile-auth-btn">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

