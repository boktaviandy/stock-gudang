import React, { useState } from 'react';
import { ClipboardCheck, Check, Search, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useInventoryStore } from '../store/inventoryStore';
import { Badge } from '../components/ui/Badge';

export const StockOpnamePage = () => {
  const { user, isSuperAdmin, getAssignedWarehouse } = useAuthStore();
  const { opnames, warehouses, products, stocks, addOpname } = useInventoryStore();

  const assignedWh = getAssignedWarehouse();

  // Form state
  const [warehouseId, setWarehouseId] = useState(assignedWh || 'JKT');
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [actualQty, setActualQty] = useState('');
  const [reason, setReason] = useState('Rusak / Fisik Cacat');
  const [notes, setNotes] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  // Fetch current system stock for selected product & warehouse
  const systemQty = (stocks[productId] && stocks[productId][warehouseId]) || 0;
  const numericActual = actualQty === '' ? systemQty : Number(actualQty);
  const variance = numericActual - systemQty;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (actualQty === '') return;

    addOpname({
      warehouseId,
      productId,
      systemQty,
      actualQty: numericActual,
      variance,
      reason,
      notes,
      createdBy: user?.name || 'Admin Gudang'
    });

    // Reset form
    setActualQty('');
    setNotes('');
    alert('Stock Opname berhasil disimpan! Stok sistem telah diperbarui.');
  };

  const selectedProd = products.find(p => p.id === productId);

  const filteredOpnames = opnames.filter(o => {
    const p = products.find(prod => prod.id === o.productId);
    return p?.name.toLowerCase().includes(searchQuery.toLowerCase()) || o.reason.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ClipboardCheck size={24} color="var(--primary)" />
          Stock Opname & Penyesuaian (Adjustment)
        </h1>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          Koreksi selisih stok fisik riil di lapangan vs pencatatan sistem (karena barang rusak, hilang, atau salah input)
        </p>
      </div>

      {/* Form Card */}
      <div className="glass-panel p-5" style={{ padding: '24px', maxWidth: '720px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
          📝 Form Penyesuaian Stok Baru
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Gudang Opname *</label>
              <select
                className="form-select"
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
                disabled={!isSuperAdmin() && Boolean(assignedWh)}
              >
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>📍 {w.name} ({w.city})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Pilih Produk SKU *</label>
              <select
                className="form-select"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.sku} — {p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* System vs Actual Calculation Box */}
          <div 
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-color)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '16px',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Stok di Sistem</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {systemQty} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>{selectedProd?.unit}</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}>Stok Fisik Riil (Input) *</div>
              <input
                type="number"
                className="form-control"
                style={{ fontSize: '1.2rem', fontWeight: 700, textAlign: 'center', borderColor: 'var(--primary)' }}
                placeholder={systemQty}
                value={actualQty}
                onChange={(e) => setActualQty(e.target.value)}
                required
              />
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Hasil Selisih</div>
              <div 
                style={{ 
                  fontSize: '1.4rem', 
                  fontWeight: 800, 
                  color: variance < 0 ? 'var(--danger)' : (variance > 0 ? 'var(--success)' : 'var(--text-muted)') 
                }}
              >
                {variance > 0 ? `+${variance}` : variance} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>{selectedProd?.unit}</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Alasan Penyesuaian *</label>
            <select
              className="form-select"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="Rusak / Fisik Cacat">Rusak / Fisik Cacat</option>
              <option value="Hilang / Selisih Fisik">Hilang / Selisih Fisik</option>
              <option value="Kadaluarsa / Expired">Kadaluarsa / Expired</option>
              <option value="Kesalahan Input Sebelumnya">Kesalahan Input Logistik Sebelumnya</option>
              <option value="Lain-lain">Lain-lain</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Catatan Tambahan Audit</label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="Jelaskan detail selisih fisik..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary btn-lg">
              <Check size={18} />
              <span>Simpan Penyesuaian Stok</span>
            </button>
          </div>
        </form>
      </div>

      {/* History Table */}
      <div className="glass-panel p-5" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
          📋 Riwayat Penyesuaian Stock Opname
        </h3>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Produk</th>
                <th>Gudang</th>
                <th>Stok Sistem</th>
                <th>Stok Riil</th>
                <th>Selisih</th>
                <th>Alasan</th>
                <th>Admin</th>
              </tr>
            </thead>
            <tbody>
              {filteredOpnames.map(op => {
                const prod = products.find(p => p.id === op.productId);
                const wh = warehouses.find(w => w.id === op.warehouseId);
                return (
                  <tr key={op.id}>
                    <td style={{ fontSize: '0.85rem' }}>{op.date}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{prod?.name || op.productId}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{prod?.sku}</div>
                    </td>
                    <td>
                      <Badge variant="neutral">📍 {wh?.city || op.warehouseId}</Badge>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{op.systemQty} pcs</td>
                    <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>{op.actualQty} pcs</td>
                    <td>
                      <span style={{ fontWeight: 700, color: op.variance < 0 ? 'var(--danger)' : (op.variance > 0 ? 'var(--success)' : 'var(--text-muted)') }}>
                        {op.variance > 0 ? `+${op.variance}` : op.variance} pcs
                      </span>
                    </td>
                    <td>
                      <Badge variant="warning">{op.reason}</Badge>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{op.createdBy}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
