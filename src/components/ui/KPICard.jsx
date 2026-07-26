import React from 'react';

export const KPICard = ({ title, value, subtext, icon: Icon, color = 'var(--primary)', trend, onClick }) => {
  return (
    <div 
      className={`glass-panel p-5 cursor-pointer relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-[var(--primary)]`}
      onClick={onClick}
      style={{ padding: '20px' }}
    >
      <div className="flex items-center justify-between mb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {title}
        </span>
        {Icon && (
          <div 
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: `${color}18`,
              color: color 
            }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.03em' }}>
        {value}
      </div>

      {subtext && (
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {trend && (
            <span style={{ color: trend.startsWith('+') ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
              {trend}
            </span>
          )}
          <span>{subtext}</span>
        </div>
      )}

      {/* Subtle accent bar on bottom */}
      <div 
        style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          height: '3px', 
          backgroundColor: color,
          opacity: 0.8
        }} 
      />
    </div>
  );
};
