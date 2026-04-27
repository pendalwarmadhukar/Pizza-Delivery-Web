import React from 'react';
import { Flame, MapPin, Phone } from 'lucide-react';
import '../styles/Navbar.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3 className="footer-logo">
              <Flame className="text-primary" /> Pizza Hub
            </h3>
            <p className="footer-desc">
              Bringing the authentic taste of Italy right to your doorstep. Baked with love, delivered with speed.
            </p>
            <div className="social-links">
              {['FB', 'IG', 'TW'].map(social => (
                <div key={social} className="social-btn cursor-pointer">
                  {social}
                </div>
              ))}
            </div>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="footer-list">
              <li className="footer-list-item">
                <MapPin size={20} className="text-primary footer-icon" />
                <span>42 Pizza Street, Bandra West,<br/>Mumbai, Maharashtra 400050</span>
              </li>
              <li className="footer-list-item">
                <Phone size={20} className="text-primary footer-icon" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Opening Hours</h4>
            <ul className="footer-list">
              <li className="footer-hours-item">
                <span className="hours-day">Mon - Thu:</span> <span className="hours-time">11 AM - 10 PM</span>
              </li>
              <li className="footer-hours-item">
                <span className="hours-day">Fri - Sat:</span> <span className="hours-time">11 AM - 12 AM</span>
              </li>
              <li className="footer-hours-item no-border">
                <span className="hours-day">Sunday:</span> <span className="hours-time">12 PM - 10 PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Pizza Hub. Built with passion for pizza lovers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
