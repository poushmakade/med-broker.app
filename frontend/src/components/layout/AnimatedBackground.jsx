import React from 'react';
import './AnimatedBackground.css';

// A quiet decorative canvas replaces the old pointer-tracking particle animation.
// It adds no listeners, canvas loops, or content for assistive technologies.
export default function AnimatedBackground() {
  return <div className="animated-background-container" aria-hidden="true" />;
}
