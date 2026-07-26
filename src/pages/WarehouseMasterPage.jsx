import React, { useState } from 'react';
import { Warehouse, MapPin, User, Phone, Edit, Building2 } from 'lucide-react';
import { useInventoryStore } from '../store/inventoryStore';
import { Modal } from '../components/ui/Modal';

export const WarehouseMasterPage = () => {
  const { warehouses, stocks, products } = useInventoryStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWh, setSelectedWh] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    address: '',
    pic: '',
    phone: '',
    capacity: 10000
  });

  const handleEdit = (wh) => {
    setSelectedWh(wh);
    setFormData(wh);
    setIsModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Warehouse size={24} color="var(--primary)" />
          Master Data 6 Lokasi Gudang
        </h1>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          Pengaturan daftar 6 lokasi gudang (Jakarta, Bali, Lombok, Sulawesi, Jateng, Jogja) beserta informasi PIC dan kapasitas
        </p>
      </div>

      {/* Grid of 6 Warehouse Cards */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}
      >
        {warehouses.map(wh => {
          let totalStockInWh = 0;
          products.forEach(p => {
            totalStockInWh += (stocks[p.id] && stocks[p.id][wh.id]) || 0;
          });
          const usedPercent = Math.min(100, Math.round((totalStockInWh / wh.capacity) * 100));

          return (
            <div key={wh.id} className="glass-panel p-5" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div 
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: `${wh.color}20`,
                        color: wh.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{wh.name}</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Kode: {wh.id}</span>
                    </div>
                  </div>

                  <button onClick={() => handleEdit(wh)} className="btn btn-secondary btn-sm">
                    <Edit size={14} />
                    <span>Edit</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <MapPin size={16} color="var(--text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>{wh.address}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <User size={16} color="var(--text-muted)" />
                    <span>PIC: <strong>{wh.pic}</strong></span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Phone size={16} color="var(--text-muted)" />
                    <span>📞 {wh.phone}</span>
                  </div>
                </div>
              </div>

              {/* Capacity Bar */}
              <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Kapasitas Gudang ({usedPercent}%)</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {totalStockInWh.toLocaleString('id-ID')} / {wh.capacity.toLocaleString('id-ID')} pcs
                  </span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${usedPercent}%`, backgroundColor: wh.color, borderRadius: '4px' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedWh ? `Edit Info Gudang: ${selectedWh.name}` : ''}
      >
        <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Nama Gudang *</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Alamat Lengkap *</label>
            <textarea
              className="form-control"
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Person In Charge (PIC) *</label>
              <input
                type="text"
                className="form-control"
                value={formData.pic}
                onChange={(e) => setFormData({ ...formData, pic: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">No. Telepon / WhatsApp *</label>
              <input
                type="text"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Batas Maksimal Kapasitas (Pcs) *</label>
            <input
              type="number"
              className="form-control"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
