import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Plus, ArrowUpRight } from 'lucide-react';
import './PublicNavigation.css';

export default function PublicNavigation() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname, location.hash]);
  useEffect(() => {
    const close = (event) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  return <header className="mi-public-header">
    <div className="mi-public-nav">
      <Link className="mi-brand" to="/" aria-label="PharmaSense home"><span className="mi-brand-icon"><Plus size={24} strokeWidth={3}/></span><span>Pharma<span>Sense</span><small>AI PLATFORM</small></span></Link>
      <button className="mi-nav-toggle" type="button" aria-expanded={open} aria-controls="mi-public-menu" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)}>{open ? <X size={22}/> : <Menu size={22}/>}</button>
      <nav id="mi-public-menu" className={`mi-public-menu ${open ? 'is-open' : ''}`} aria-label="Main navigation">
        <Link to="/#features">Explore PharmaSense</Link><Link to="/#benefits">For suppliers</Link><Link to="/about">About us</Link>
        <span className="mi-nav-divider"/>
        <Link className="mi-nav-signin" to="/login">Sign in</Link><Link className="mi-nav-cta" to="/register">Get started <ArrowUpRight size={16}/></Link>
      </nav>
    </div>
  </header>;
}
