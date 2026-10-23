import React from 'react';

export default function BrandLogo({ size = 24, showBadge = true, variant = 'dark' }) {
  const isLight = variant === 'light';

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', userSelect: 'none' }}>
      <div
        style={{
          width: size + 12,
          height: size + 12,
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #2563eb 0%, #0284c7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
          flexShrink: 0
        }}
      >
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 3L4 7.5V12C4 16.8 7.4 20.3 12 21C16.6 20.3 20 16.8 20 12V7.5L12 3Z"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M12 8V16M8 12H16" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="12" cy="12" r="2.2" fill="#38bdf8" />
        </svg>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
        <span
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: isLight ? '#ffffff' : '#0f172a',
            fontFamily: "'Inter', sans-serif"
          }}
        >
          Pharma<span style={{ color: isLight ? '#93c5fd' : '#2563eb' }}>Sense</span>
        </span>
        {showBadge && (
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              background: isLight ? 'rgba(255, 255, 255, 0.15)' : '#eff6ff',
              color: isLight ? '#ffffff' : '#2563eb',
              border: isLight ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid #bfdbfe',
              padding: '0.12rem 0.45rem',
              borderRadius: '999px'
            }}
          >
            AI
          </span>
        )}
      </div>
    </div>
  );
}
