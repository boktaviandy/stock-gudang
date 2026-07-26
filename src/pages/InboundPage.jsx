import React, { useState } from 'react';
import { ArrowDownLeft, Plus, Search, Calendar, Building2, Check } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useInventoryStore } from '../store/inventoryStore';
import { Badge } from '../components/ui/Badge';
import { Drawer } from '../components/ui/Drawer';

export const InboundPage = () => {
  const { user, isSuperAdmin, getAssignedWarehouse } = useAuthStore();
  const { inbounds, warehouses, products, addInbound } = useInventoryStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const assignedWh = getAssignedWarehouse();
  const [formData, setFormData] = useState({
    warehouseId: assignedWh || 'JKT',
    date: new Date().toISOString().split('T')[0],
    refNo: '',
    supplier: '',
    notes: '',
    items: [{ productId: products[0]?.id || '', qty: 10 }]
  });

  const handleAddItemRow = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productId: products[0]?.id || '', qty: 10 }]
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

    // Map item details
    const preparedItems = formData.items.map(item => {
      const p = products.find(prod => prod.id === item.productId);
      return {
        productId: item.productId,
        sku: p?.sku || '',
        name: p?.name || '',
        qty: Number(item.qty)
      };
    });

    addInbound({
      warehouseId: formData.warehouseId,
      date: formData.date,
      refNo: formData.refNo,
      supplier: formData.supplier,
      notes: formData.notes,
      items: preparedItems,
      createdBy: user?.name || 'Admin Gudang'
    });

    setIsFormOpen(false);
    // Reset form
    setFormData({
      warehouseId: assignedWh || 'JKT',
      date: new Date().toISOString().split('T')[0],
      refNo: '',
      supplier: '',
      notes: '',
      items: [{ productId: products[0]?.id || '', qty: 10 }]
    });
  };

  const filteredInbounds = inbounds.filter(i => 
    i.refNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ArrowDownLeft size={24} color="var(--success)" />
            Penerimaan Barang Masuk (Inbound)
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Pencatatan faktur barang masuk dari pemasok ke lokasi gudang
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="btn btn-success"
        >
          <Plus size={18} />
          <span>+ Input Barang Masuk</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4" style={{ padding: '16px', display: 'flex', gap: '12px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '38px' }}
            placeholder="Cari berdasarkan No SJ / Pemasok / Admin..."
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
              <th>No. SJ / PO</th>
              <th>Tanggal</th>
              <th>Produk & Jumlah</th>
              <th>Pemasok</th>
              <th>Gudang Tujuan</th>
              <th>Admin Input</th>
              <th>Catatan</th>
            </tr>
          </thead>
          <tbody>
            {filteredInbounds.map(inb => {
              const wh = warehouses.find(w => w.id === inb.warehouseId);
              return (
                <tr key={inb.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                      {inb.refNo}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{inb.id}</div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{inb.date}</td>
                  <td>
                    {inb.items.map((item, idx) => (
                      <div key={idx} style={{ fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: 600 }}>{item.name}</span>{' '}
                        <Badge variant="success" showDot={false}>+{item.qty} pcs</Badge>
                      </div>
                    ))}
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {inb.supplier}
                  </td>
                  <td>
                    <Badge variant="neutral">📍 {wh?.city || inb.warehouseId}</Badge>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{inb.createdBy}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{inb.notes || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Slide-over Form Drawer */}
      <Drawer
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="📥 Form Inbound (Barang Masuk)"
        width="500px"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Gudang Tujuan *</label>
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
              <label className="form-label">Tanggal Masuk *</label>
              <input
                type="date"
                className="form-control"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">No. Surat Jalan / PO</label>
              <input
                type="text"
                className="form-control"
                placeholder="SJ-2026-XXXX"
                value={formData.refNo}
                onChange={(e) => setFormData({ ...formData, refNo: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nama Pemasok / Supplier</label>
            <input
              type="text"
              className="form-control"
              placeholder="PT Supplier Utama"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            />
          </div>

          <hr style={{ borderColor: 'var(--border-color)', margin: '8px 0' }} />

          <div>
            <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Daftar Produk Masuk *</label>
            
            {formData.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
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
                  style={{ flex: 1, textAlign: 'center' }}
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
            ))}

            <button
              type="button"
              onClick={handleAddItemRow}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginTop: '6px' }}
            >
              + Tambah Baris Produk
            </button>
          </div>

          <div className="form-group" style={{ marginTop: '8px' }}>
            <label className="form-label">Catatan Tambahan</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Keterangan pengiriman..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
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
              className="btn btn-success"
            >
              <Check size={16} />
              <span>Simpan Inbound</span>
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};
