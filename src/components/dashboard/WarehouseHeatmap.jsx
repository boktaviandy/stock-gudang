import React from 'react';
import { Building2, AlertTriangle, ChevronRight, Boxes } from 'lucide-react';
import { useInventoryStore } from '../../store/inventoryStore';

export const WarehouseHeatmap = ({ onSelectWarehouse }) => {
  const { warehouses, stocks, products, setSelectedWarehouseFilter } = useInventoryStore();

  // Compute total stock count & low stock alerts count per warehouse
  const getWarehouseMetrics = (whId) => {
    let totalQty = 0;
    let lowStockCount = 0;
    let totalSkus = 0;

    products.forEach(p => {
      const qty = (stocks[p.id] && stocks[p.id][whId]) || 0;
      totalQty += qty;
      if (qty > 0) totalSkus += 1;
      if (qty <= p.minStock) lowStockCount += 1;
    });

    return { totalQty, lowStockCount, totalSkus };
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building2 size={18} color="var(--primary)" />
          Status & Kapasitas 6 Gudang Nasional
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Real-time Stock Capacity
        </span>
      </div>

      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}
      >
        {warehouses.map(wh => {
          const { totalQty, lowStockCount, totalSkus } = getWarehouseMetrics(wh.id);
          const percentUsed = Math.min(100, Math.round((totalQty / wh.capacity) * 100));

          // Color logic for status
          let statusColor = 'var(--success)';
          let statusText = 'Normal';
          if (lowStockCount > 0) {
            statusColor = lowStockCount > 1 ? 'var(--danger)' : 'var(--warning)';
            statusText = `${lowStockCount} Alert Kritis`;
          }

          return (
            <div
              key={wh.id}
              className="glass-panel"
              onClick={() => {
                setSelectedWarehouseFilter(wh.id);
                if (onSelectWarehouse) onSelectWarehouse(wh.id);
              }}
              style={{
                padding: '16px 20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: wh.color }} />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {wh.city} ({wh.id})
                  </span>
                </div>

                <div 
                  style={{
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    backgroundColor: `${statusColor}18`,
                    color: statusColor,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {lowStockCount > 0 && <AlertTriangle size={12} />}
                  <span>{statusText}</span>
                </div>
              </div>

              {/* Stock numbers */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {totalQty.toLocaleString('id-ID')}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  pcs / {wh.capacity.toLocaleString('id-ID')} cap
                </span>
              </div>

              {/* Capacity Progress Bar */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <span>Utilisasi Kapasitas</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{percentUsed}%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div 
                    style={{
                      height: '100%',
                      width: `${percentUsed}%`,
                      backgroundColor: wh.color,
                      borderRadius: '3px',
                      transition: 'width 0.5s ease'
                    }}
                  />
                </div>
              </div>

              {/* Sub details */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Boxes size={14} />
                  <span>{totalSkus} SKU Tersedia</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--primary)', fontWeight: 600 }}>
                  <span>Detail</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
