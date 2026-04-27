import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { Pizza, ShoppingBag, User, LogOut, Settings, MapPin, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [address, setAddress] = useState(() => localStorage.getItem('deliveryLocation') || 'Detecting location...');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="navbar-logo-icon">🍕</span>
        <span className="navbar-logo-text">Pizza Hub</span>
      </Link>

      <div className="navbar-location hidden md:flex" onClick={handleUpdateLocation}>
        <MapPin size={16} className="text-primary" />
        <div>
          <div className="navbar-location-label">Deliver to</div>
          <div className="navbar-location-address">{address}</div>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="navbar-links hidden lg:flex">
        <Link to="/menu" className={`nav-link ${isActive('/menu') ? 'active' : ''}`}>Menu</Link>
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

      {/* Mobile Actions */}
      <div className="flex items-center gap-4 lg:hidden">
        <button onClick={handleUpdateLocation} className="p-2 text-primary">
          <MapPin size={24} />
        </button>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="p-2 text-secondary hover:text-white transition"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-lg z-50 transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible lg:hidden'}`}>
        <div className={`absolute right-0 top-0 h-full w-4/5 max-w-xs bg-dark p-8 shadow-2xl transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-12">
            <span className="text-2xl font-bold">Menu</span>
            <button onClick={() => setIsMenuOpen(false)}><X size={28} /></button>
          </div>

          <div className="space-y-6">
            <Link to="/menu" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-4 text-xl ${isActive('/menu') ? 'text-primary' : ''}`}>
              <Pizza size={24} /> Menu
            </Link>
            <Link to="/builder" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-4 text-xl ${isActive('/builder') ? 'text-primary' : ''}`}>
              <Settings size={24} /> Builder
            </Link>
            
            <hr className="border-white/10 my-4" />

            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 text-xl">
                    <Settings size={24} /> Admin Dashboard
                  </Link>
                ) : (
                  <Link to="/my-orders" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 text-xl">
                    <ShoppingBag size={24} /> My Orders
                  </Link>
                )}
                <div className="pt-6">
                  <div className="flex items-center gap-4 mb-6 text-secondary">
                    <User size={24} /> {user.name}
                  </div>
                  <button onClick={handleLogout} className="btn-primary w-full py-4 flex items-center justify-center gap-3">
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4 pt-4">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn-secondary w-full py-4 block text-center">Login</Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn-primary w-full py-4 block text-center">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

