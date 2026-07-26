import React from 'react';

export const Badge = ({ variant = 'neutral', children, showDot = true, className = '' }) => {
  const variantMap = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    neutral: 'badge-neutral'
  };

  return (
    <span className={`badge ${variantMap[variant] || 'badge-neutral'} ${className}`}>
      {showDot && <span className="badge-dot" />}
      {children}
    </span>
  );
};
