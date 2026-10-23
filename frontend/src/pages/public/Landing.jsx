import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Search, Pill, PackageCheck, Sparkles, Building2, Layers3, ShieldCheck, HeartPulse, Check, Stethoscope } from 'lucide-react';
import PublicNavigation from '../../components/layout/PublicNavigation';
import Footer from '../../components/layout/Footer';
import './Landing.css';

const features = [
  {icon: Search, title: 'Find what care needs.', text: 'Explore medicine information, compare available listings and find the right supplies for your workflow.', label: 'DISCOVER'},
  {icon: Layers3, title: 'Your orders, together.', text: 'Keep retail and wholesale purchasing organized with a cart, clear order history and one connected workspace.', label: 'ORGANIZE'},
  {icon: Sparkles, title: 'A little guidance helps.', text: 'Ask the PharmaSense assistant for platform help and general health information, whenever you need a starting point.', label: 'GET SUPPORT'}
];
export default function Landing() {
  return <div className="mi-home">
    <PublicNavigation/>
    <main>
      <section className="mi-hero" aria-labelledby="mi-hero-title">
        <div className="mi-home-container mi-hero-grid">
          <div className="mi-hero-copy">
            <span className="mi-eyebrow"><span/> A MORE CONNECTED WAY TO CARE</span>
            <h1 id="mi-hero-title">Better supplies.<br/>Simpler days.<br/><em>Care comes first.</em></h1>
            <p>Bring your medicine discovery, purchasing and supply management together. A calmer workspace for people who put care first.</p>
            <div className="mi-hero-actions"><Link className="mi-button mi-button-primary" to="/customer/catalog">Explore medicines <ArrowRight size={18}/></Link><Link className="mi-button mi-button-secondary" to="/register">Join as a supplier <ArrowUpRight size={18}/></Link></div>
            <div className="mi-hero-notes"><span><Check size={15}/> Retail & wholesale</span><span><Check size={15}/> One connected platform</span></div>
          </div>
          <div className="mi-hero-visual" aria-label="Illustration of the PharmaSense workspace">
            <div className="mi-visual-orbit mi-orbit-one"/><div className="mi-visual-orbit mi-orbit-two"/>
            <div className="mi-workspace-preview">
              <div className="mi-preview-top"><span><HeartPulse size={20}/> Your care workspace</span><span className="mi-preview-label">A CLOSER LOOK</span></div>
              <div className="mi-preview-greeting"><small>Everything in its place</small><h2>A clearer view of your day.</h2></div>
              <div className="mi-preview-search"><Search size={17}/><span>Discover medicines and supplies</span><span>⌘ K</span></div>
              <div className="mi-preview-heading"><span>One space. More possibilities.</span><Pill size={17}/></div>
              <div className="mi-preview-row"><div className="mi-preview-icon"><Pill size={23}/></div><div><strong>Medicine discovery</strong><span>Information, organized around you</span></div><ArrowUpRight size={17}/></div>
              <div className="mi-preview-row"><div className="mi-preview-icon mi-icon-orchid"><PackageCheck size={23}/></div><div><strong>Orders & inventory</strong><span>Keep the essentials in view</span></div><ArrowUpRight size={17}/></div>
              <div className="mi-preview-assistant"><Sparkles size={18}/><div><strong>Meet your PharmaSense assistant</strong><span>A helpful place to start your next question.</span></div><ArrowRight size={17}/></div>
            </div>
            <div className="mi-floating-note"><span><Stethoscope size={22}/></span><div><strong>Built around healthcare</strong><small>Thoughtful tools. Everyday clarity.</small></div></div>
          </div>
        </div>
      </section>
      <section className="mi-audience" aria-label="Who PharmaSense is for"><div className="mi-home-container"><span>MADE FOR EVERY PART OF CARE</span><div><span><HeartPulse size={19}/> Individuals</span><span><Building2 size={19}/> Clinics & hospitals</span><span><Pill size={19}/> Pharmacies</span><span><PackageCheck size={19}/> Suppliers</span></div></div></section>
      <section id="features" className="mi-features mi-home-container">
        <div className="mi-section-heading"><div><span className="mi-eyebrow">LESS FRICTION. MORE FOCUS.</span><h2>Your essentials.<br/>Thoughtfully connected.</h2></div><p>From the first search to your next order, keep the details together and make more room for what matters.</p></div>
        <div className="mi-feature-grid">{features.map(({icon:Icon,title,text,label})=><article className="mi-feature" key={title}><span className="mi-feature-icon"><Icon size={25}/></span><small>{label}</small><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>
      <section id="benefits" className="mi-supplier-section"><div className="mi-home-container mi-supplier-grid"><div className="mi-supplier-art"><div className="mi-supplier-symbol"><Building2 size={60} strokeWidth={1.4}/></div><span className="mi-supplier-caption">A workspace that grows with your business.</span><div className="mi-supplier-chips"><span><Pill size={16}/> Product listings</span><span><PackageCheck size={16}/> Inventory</span><span><Layers3 size={16}/> Order management</span></div></div><div><span className="mi-eyebrow">FOR THE PEOPLE BEHIND THE SUPPLY</span><h2>Put your business<br/>in a better rhythm.</h2><p>Manage product listings, inventory, incoming orders and business insights from your supplier workspace.</p><ul><li><Check size={17}/> Keep product and stock information together</li><li><Check size={17}/> Follow orders through your daily workflow</li><li><Check size={17}/> Access account and compliance tools</li></ul><Link className="mi-button mi-button-primary" to="/register">Create a supplier account <ArrowUpRight size={17}/></Link></div></div></section>
      <section className="mi-home-container mi-start"><span className="mi-start-icon"><ShieldCheck size={26}/></span><h2>Make space for better care.</h2><p>Start with a simpler way to connect your healthcare essentials.</p><Link className="mi-button mi-button-primary" to="/register">Get started with PharmaSense <ArrowRight size={17}/></Link><small>Already part of PharmaSense? <Link to="/login">Sign in to your workspace</Link></small></section>
    </main>
    <Footer/>
  </div>;
}
