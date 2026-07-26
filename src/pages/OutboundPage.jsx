import React, { useState } from 'react';
import { ArrowUpRight, Plus, Search, AlertTriangle, Check } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useInventoryStore } from '../store/inventoryStore';
import { Badge } from '../components/ui/Badge';
import { Drawer } from '../components/ui/Drawer';

export const OutboundPage = () => {
  const { user, isSuperAdmin, getAssignedWarehouse } = useAuthStore();
  const { outbounds, warehouses, products, stocks, addOutbound } = useInventoryStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const assignedWh = getAssignedWarehouse();
  const [formData, setFormData] = useState({
    warehouseId: assignedWh || 'JKT',
    date: new Date().toISOString().split('T')[0],
    refNo: '',
    customer: '',
    reason: 'Penjualan / Client Order',
    notes: '',
    items: [{ productId: products[0]?.id || '', qty: 5 }]
  });

  const handleAddItemRow = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productId: products[0]?.id || '', qty: 5 }]
    }));
  };

  const handleRemoveItemRow = (idx) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx)
    }));
  };

  const handleItemChange = (idx, field, value) => {
    setFormData(prev => {
      const updatedItems = [...prev.items];
      updatedItems[idx][field] = value;
      return { ...prev, items: updatedItems };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const preparedItems = formData.items.map(item => {
      const p = products.find(prod => prod.id === item.productId);
      return {
        productId: item.productId,
        sku: p?.sku || '',
        name: p?.name || '',
        qty: Number(item.qty)
      };
    });

    const res = addOutbound({
      warehouseId: formData.warehouseId,
      date: formData.date,
      refNo: formData.refNo,
      customer: formData.customer,
      reason: formData.reason,
      notes: formData.notes,
      items: preparedItems,
      createdBy: user?.name || 'Admin Gudang'
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Gagal menyimpan barang keluar');
      return;
    }

    setIsFormOpen(false);
    setFormData({
      warehouseId: assignedWh || 'JKT',
      date: new Date().toISOString().split('T')[0],
      refNo: '',
      customer: '',
      reason: 'Penjualan / Client Order',
      notes: '',
      items: [{ productId: products[0]?.id || '', qty: 5 }]
    });
  };

  const filteredOutbounds = outbounds.filter(o =>
    o.refNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ArrowUpRight size={24} color="var(--danger)" />
            Pengeluaran Barang (Outbound)
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Pencatatan pengiriman barang keluar untuk penjualan, pemakaian internal, atau retur
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="btn btn-danger"
        >
          <Plus size={18} />
          <span>+ Input Barang Keluar</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4" style={{ padding: '16px', display: 'flex', gap: '12px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '38px' }}
            placeholder="Cari No DO / Pelanggan / Admin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="table-container glass-panel">
        <table className="custom-table">
          <thead>
            <tr>
              <th>No. DO / Nota</th>
              <th>Tanggal</th>
              <th>Produk & Jumlah</th>
              <th>Tujuan / Pelanggan</th>
              <th>Gudang Asal</th>
              <th>Alasan Keluar</th>
              <th>Admin Input</th>
            </tr>
          </thead>
          <tbody>
            {filteredOutbounds.map(outb => {
              const wh = warehouses.find(w => w.id === outb.warehouseId);
              return (
                <tr key={outb.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                      {outb.refNo}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{outb.id}</div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{outb.date}</td>
                  <td>
                    {outb.items.map((item, idx) => (
                      <div key={idx} style={{ fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: 600 }}>{item.name}</span>{' '}
                        <Badge variant="danger" showDot={false}>-{item.qty} pcs</Badge>
                      </div>
                    ))}
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {outb.customer}
                  </td>
                  <td>
                    <Badge variant="neutral">📍 {wh?.city || outb.warehouseId}</Badge>
                  </td>
                  <td>
                    <Badge variant="info">{outb.reason}</Badge>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{outb.createdBy}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Drawer Form */}
      <Drawer
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="📤 Form Outbound (Barang Keluar)"
        width="500px"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {errorMessage && (
            <div style={{ padding: '12px', borderRadius: '6px', backgroundColor: 'var(--danger-bg)', border: '1px solid var(--danger-border)', color: 'var(--danger)', fontSize: '0.85rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <AlertTriangle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Gudang Asal *</label>
            <select
              className="form-select"
              value={formData.warehouseId}
              onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
              disabled={!isSuperAdmin() && Boolean(assignedWh)}
            >
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>📍 {w.name} ({w.city})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Tanggal Keluar *</label>
              <input
                type="date"
                className="form-control"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">No. DO / Nota</label>
              <input
                type="text"
                className="form-control"
                placeholder="DO-2026-XXXX"
                value={formData.refNo}
                onChange={(e) => setFormData({ ...formData, refNo: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tujuan / Pelanggan *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Toko Elektronik / Client"
              value={formData.customer}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Alasan Keluar *</label>
            <select
              className="form-select"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            >
              <option value="Penjualan / Client Order">Penjualan / Client Order</option>
              <option value="Pemakaian Internal">Pemakaian Internal HO / Cabang</option>
              <option value="Barang Rusak / Afkir">Barang Rusak / Afkir</option>
              <option value="Retur ke Supplier">Retur ke Supplier</option>
            </select>
          </div>

          <hr style={{ borderColor: 'var(--border-color)', margin: '4px 0' }} />

          <div>
            <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Daftar Produk Keluar *</label>
            
            {formData.items.map((item, idx) => {
              const currentStockInWh = (stocks[item.productId] && stocks[item.productId][formData.warehouseId]) || 0;
              const isOver = item.qty > currentStockInWh;

              return (
                <div key={idx} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <select
                      className="form-select"
                      style={{ flex: 2 }}
                      value={item.productId}
                      onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.sku} — {p.name}</option>
                      ))}
                    </select>

                    <input
                      type="number"
                      className="form-control"
                      style={{ flex: 1, textAlign: 'center', borderColor: isOver ? 'var(--danger)' : undefined }}
                      min="1"
                      value={item.qty}
                      onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                      required
                    />

                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1rem' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: isOver ? 'var(--danger)' : 'var(--text-muted)' }}>
                      Stok tersedia di gudang: <strong>{currentStockInWh} pcs</strong>
                    </span>
                    {isOver && <span style={{ color: 'var(--danger)', fontWeight: 700 }}>⚠ Stok tidak mencukupi!</span>}
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={handleAddItemRow}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%' }}
            >
              + Tambah Baris Produk
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="btn btn-secondary"
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-danger"
            >
              <Check size={16} />
              <span>Simpan Outbound</span>
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};
