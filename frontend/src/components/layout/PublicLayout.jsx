import React from 'react';
import PublicNavigation from './PublicNavigation';
import Footer from './Footer';

export default function PublicLayout({ children }) {
  return (
    <div className="mi-public-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-secondary, #F5F3FF)' }}>
      <PublicNavigation />
      <main style={{ flex: 1, minWidth: 0, padding: '40px 0' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
