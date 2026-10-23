import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowUpRight, HeartPulse } from 'lucide-react';
import './PublicNavigation.css';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="mi-footer">
      <div className="mi-footer-inner">
        <div className="mi-footer-top">
          <div className="mi-footer-intro">
            <Link className="mi-brand" to="/" aria-label="PharmaSense home">
              <span className="mi-brand-icon"><Plus size={23} strokeWidth={3}/></span>
              <span>Pharma<span>Sense</span></span>
            </Link>
            <p>A more connected medicine marketplace.<br/>Thoughtful tools for everyday care.</p>
            <span className="mi-footer-care"><HeartPulse size={14}/> Care, connected.</span>
          </div>
          <div className="mi-footer-column">
            <h2>Explore</h2>
            <Link to="/customer/catalog">Medicine catalog</Link>
            <Link to="/about">About PharmaSense</Link>
            <Link to="/register">Become a supplier <ArrowUpRight size={12}/></Link>
          </div>
          <div className="mi-footer-column">
            <h2>Your workspace</h2>
            <Link to="/login">Sign in</Link>
            <Link to="/customer/orders">Order history</Link>
            <Link to="/customer/dashboard">Dashboard</Link>
          </div>
          <div className="mi-footer-column">
            <h2>How can we help?</h2>
            <Link to="/support/help-center">Help center</Link>
            <Link to="/support/contact-us">Contact us</Link>
            <Link to="/support/faq">Frequently asked questions</Link>
          </div>
        </div>
        <div className="mi-footer-bottom">
          <span>© {new Date().getFullYear()} PharmaSense. All rights reserved.</span>
          <Link to="/support/terms">Terms of service</Link>
          <span>Built with care.</span>
        </div>
      </div>
    </footer>
  );
}
