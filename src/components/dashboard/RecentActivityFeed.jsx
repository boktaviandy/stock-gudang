import React, { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, ClipboardCheck, Clock } from 'lucide-react';
import { useInventoryStore } from '../../store/inventoryStore';

export const RecentActivityFeed = () => {
  const { inbounds, outbounds, transfers, opnames, warehouses } = useInventoryStore();
  const [filterType, setFilterType] = useState('ALL'); // ALL, INBOUND, OUTBOUND, TRANSFER, OPNAME

  // Combine all activities into a single sorted feed
  const allActivities = [
    ...inbounds.map(i => ({
      id: i.id,
      type: 'INBOUND',
      date: i.date,
      title: `Barang Masuk (${i.items[0]?.name || 'Produk'})`,
      qty: `+${i.items.reduce((acc, x) => acc + Number(x.qty), 0)} pcs`,
      warehouse: warehouses.find(w => w.id === i.warehouseId)?.city || i.warehouseId,
      user: i.createdBy,
      ref: i.refNo
    })),
    ...outbounds.map(o => ({
      id: o.id,
      type: 'OUTBOUND',
      date: o.date,
      title: `Barang Keluar (${o.items[0]?.name || 'Produk'})`,
      qty: `-${o.items.reduce((acc, x) => acc + Number(x.qty), 0)} pcs`,
      warehouse: warehouses.find(w => w.id === o.warehouseId)?.city || o.warehouseId,
      user: o.createdBy,
      ref: o.refNo
    })),
    ...transfers.map(t => ({
      id: t.id,
      type: 'TRANSFER',
      date: t.date,
      title: `Transfer ${warehouses.find(w => w.id === t.fromWarehouse)?.city} ➔ ${warehouses.find(w => w.id === t.toWarehouse)?.city}`,
      qty: `${t.items.reduce((acc, x) => acc + Number(x.qty), 0)} pcs (${t.status})`,
      warehouse: `${t.fromWarehouse} to ${t.toWarehouse}`,
      user: t.createdBy,
      ref: t.id
    })),
    ...opnames.map(op => ({
      id: op.id,
      type: 'OPNAME',
      date: op.date,
      title: `Stock Opname (Selisih: ${op.variance > 0 ? '+' : ''}${op.variance})`,
      qty: `${op.variance > 0 ? '+' : ''}${op.variance} pcs`,
      warehouse: warehouses.find(w => w.id === op.warehouseId)?.city || op.warehouseId,
      user: op.createdBy,
      ref: op.reason
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredFeed = filterType === 'ALL'
    ? allActivities
    : allActivities.filter(a => a.type === filterType);

  return (
    <div className="glass-panel p-5" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} color="var(--primary)" />
          Aktivitas Transaksi Terbaru
        </h3>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-surface-elevated)', padding: '3px', borderRadius: 'var(--radius-sm)' }}>
          {['ALL', 'INBOUND', 'OUTBOUND', 'TRANSFER'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              style={{
                padding: '4px 10px',
                fontSize: '0.72rem',
                fontWeight: 600,
                borderRadius: '4px',
                border: 'none',
                backgroundColor: filterType === tab ? 'var(--primary)' : 'transparent',
                color: filterType === tab ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab === 'ALL' ? 'Semua' : tab}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredFeed.slice(0, 7).map(item => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              backgroundColor: 'rgba(15, 17, 23, 0.4)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.86rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div 
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 
                    item.type === 'INBOUND' ? 'var(--success-bg)' :
                    item.type === 'OUTBOUND' ? 'var(--danger-bg)' :
                    item.type === 'TRANSFER' ? 'var(--warning-bg)' : 'rgba(108, 117, 125, 0.15)',
                  color:
                    item.type === 'INBOUND' ? 'var(--success)' :
                    item.type === 'OUTBOUND' ? 'var(--danger)' :
                    item.type === 'TRANSFER' ? 'var(--warning)' : 'var(--text-secondary)'
                }}
              >
                {item.type === 'INBOUND' && <ArrowDownLeft size={16} />}
                {item.type === 'OUTBOUND' && <ArrowUpRight size={16} />}
                {item.type === 'TRANSFER' && <ArrowLeftRight size={16} />}
                {item.type === 'OPNAME' && <ClipboardCheck size={16} />}
              </div>

              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  📍 {item.warehouse} • Oleh {item.user} ({item.date})
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div 
                style={{
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: item.type === 'INBOUND' ? 'var(--success)' : (item.type === 'OUTBOUND' ? 'var(--danger)' : 'var(--text-primary)')
                }}
              >
                {item.qty}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {item.ref}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
