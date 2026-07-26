import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, Check, ArrowRight, ArrowLeft, Building2, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useInventoryStore } from '../store/inventoryStore';

export const TransferCreatePage = () => {
  const navigate = useNavigate();
  const { user, isSuperAdmin, getAssignedWarehouse } = useAuthStore();
  const { warehouses, products, stocks, createTransfer } = useInventoryStore();

  const assignedWh = getAssignedWarehouse();

  // Wizard Step State
  const [step, setStep] = useState(1); // 1, 2, 3

  // Form State
  const [fromWarehouse, setFromWarehouse] = useState(assignedWh || 'JKT');
  const [toWarehouse, setToWarehouse] = useState(fromWarehouse === 'LOP' ? 'JKT' : 'LOP');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Selected items mapping: { [productId]: qtyToTransfer }
  const [selectedItemsMap, setSelectedItemsMap] = useState({
    [products[0]?.id]: 50
  });

  const handleToggleItem = (prodId, qty) => {
    setSelectedItemsMap(prev => ({
      ...prev,
      [prodId]: Number(qty)
    }));
  };

  const handleRemoveItem = (prodId) => {
    setSelectedItemsMap(prev => {
      const copy = { ...prev };
      delete copy[prodId];
      return copy;
    });
  };

  const selectedItemsList = Object.entries(selectedItemsMap)
    .filter(([_, qty]) => Number(qty) > 0)
    .map(([pId, qty]) => {
      const p = products.find(prod => prod.id === pId);
      const available = (stocks[pId] && stocks[pId][fromWarehouse]) || 0;
      return {
        productId: pId,
        sku: p?.sku || '',
        name: p?.name || '',
        unit: p?.unit || 'Pcs',
        qty: Number(qty),
        available
      };
    });

  const hasStockError = selectedItemsList.some(item => item.qty > item.available);

  const handleSubmitTransfer = () => {
    if (selectedItemsList.length === 0) {
      alert('Pilih setidaknya 1 produk untuk ditransfer!');
      return;
    }

    createTransfer({
      fromWarehouse,
      toWarehouse,
      date,
      items: selectedItemsList,
      createdBy: user?.name || 'Admin Gudang',
      notes
    });

    navigate('/app/transfer/list');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '840px', margin: '0 auto' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ArrowLeftRight size={24} color="var(--primary)" />
          Buat Mutasi Inter-Warehouse Transfer
        </h1>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          Kirim stok dari Gudang Asal ke Gudang Tujuan dalam 3 langkah mudah
        </p>
      </div>

      {/* Stepper Progress Indicator Bar */}
      <div className="glass-panel p-4" style={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          {[
            { num: 1, title: '1. Asal & Tujuan' },
            { num: 2, title: '2. Pilih Produk & Qty' },
            { num: 3, title: '3. Review & Kirim' }
          ].map(s => (
            <div 
              key={s.num}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                zIndex: 10,
                color: step === s.num ? 'var(--primary)' : (step > s.num ? 'var(--success)' : 'var(--text-muted)'),
                fontWeight: step === s.num ? 700 : 500
              }}
            >
              <div 
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: step === s.num ? 'var(--primary)' : (step > s.num ? 'var(--success)' : 'var(--bg-surface-elevated)'),
                  color: (step === s.num || step > s.num) ? '#fff' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span style={{ fontSize: '0.9rem' }}>{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: ASAL & TUJUAN */}
      {step === 1 && (
        <div className="glass-panel p-5 animate-fade-in" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px' }}>
            📍 Langkah 1 — Pilih Gudang Asal & Gudang Tujuan
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
            <div className="form-group">
              <label className="form-label">Gudang Asal Pengirim *</label>
              <select
                className="form-select"
                value={fromWarehouse}
                onChange={(e) => setFromWarehouse(e.target.value)}
                disabled={!isSuperAdmin() && Boolean(assignedWh)}
              >
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>📍 {w.name} ({w.city})</option>
                ))}
              </select>
            </div>

            <div style={{ paddingTop: '20px', color: 'var(--primary)', fontWeight: 800 }}>➔</div>

            <div className="form-group">
              <label className="form-label">Gudang Tujuan Penerima *</label>
              <select
                className="form-select"
                value={toWarehouse}
                onChange={(e) => setToWarehouse(e.target.value)}
              >
                {warehouses.filter(w => w.id !== fromWarehouse).map(w => (
                  <option key={w.id} value={w.id}>📍 {w.name} ({w.city})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label">Tanggal Rencana Kirim *</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Catatan Pengiriman</label>
              <input
                type="text"
                className="form-control"
                placeholder="Misal: Restok rutin mingguan"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn btn-primary"
            >
              <span>Lanjut ke Pilih Produk</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PILIH PRODUK & QTY */}
      {step === 2 && (
        <div className="glass-panel p-5 animate-fade-in" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
            📦 Langkah 2 — Pilih Produk & Jumlah Mutasi
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Menampilkan ketersediaan stok di Gudang Asal (<strong>{fromWarehouse}</strong>)
          </p>

          <div className="table-container" style={{ marginBottom: '24px' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Produk SKU</th>
                  <th>Stok Tersedia ({fromWarehouse})</th>
                  <th>Jumlah Transfer</th>
                  <th>Status Qty</th>
                </tr>
              </thead>
              <tbody>
                {products.map(prod => {
                  const available = (stocks[prod.id] && stocks[prod.id][fromWarehouse]) || 0;
                  const currentTransferQty = selectedItemsMap[prod.id] || 0;
                  const isOver = currentTransferQty > available;

                  return (
                    <tr key={prod.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{prod.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{prod.sku}</div>
                      </td>
                      <td style={{ fontWeight: 700, color: available > 0 ? 'var(--text-primary)' : 'var(--danger)' }}>
                        {available} {prod.unit}
                      </td>
                      <td style={{ width: '160px' }}>
                        <input
                          type="number"
                          className="form-control"
                          style={{ textAlign: 'center', borderColor: isOver ? 'var(--danger)' : undefined }}
                          min="0"
                          max={available}
                          value={currentTransferQty || ''}
                          onChange={(e) => handleToggleItem(prod.id, e.target.value)}
                          placeholder="0"
                        />
                      </td>
                      <td>
                        {isOver ? (
                          <span style={{ color: 'var(--danger)', fontSize: '0.78rem', fontWeight: 700 }}>⚠ Melebihi stok</span>
                        ) : (
                          currentTransferQty > 0 ? <span style={{ color: 'var(--success)', fontSize: '0.78rem', fontWeight: 600 }}>✓ Dipilih</span> : <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button type="button" onClick={() => setStep(1)} className="btn btn-secondary">
              <ArrowLeft size={18} />
              <span>Kembali</span>
            </button>
            <button 
              type="button" 
              onClick={() => setStep(3)} 
              className="btn btn-primary"
              disabled={selectedItemsList.length === 0 || hasStockError}
            >
              <span>Lanjut ke Review ({selectedItemsList.length} item)</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & SUBMIT */}
      {step === 3 && (
        <div className="glass-panel p-5 animate-fade-in" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
            🚚 Langkah 3 — Review Ringkasan & Konfirmasi Pengiriman
          </h3>

          <div 
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface-elevated)',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Rute Mutasi Transfer</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                📍 Gudang {fromWarehouse} ➔ 📍 Gudang {toWarehouse}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tgl Kirim</div>
              <div style={{ fontWeight: 600 }}>{date}</div>
            </div>
          </div>

          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '10px' }}>Item Produk Ditransfer:</h4>
          <div className="table-container" style={{ marginBottom: '20px' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Produk SKU</th>
                  <th>Jumlah Transfer</th>
                </tr>
              </thead>
              <tbody>
                {selectedItemsList.map((item, idx) => (
                  <tr key={item.productId}>
                    <td>{idx + 1}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.sku}</div>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--primary)' }}>
                      {item.qty} {item.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            <button type="button" onClick={() => setStep(2)} className="btn btn-secondary">
              <ArrowLeft size={18} />
              <span>Ubah Item</span>
            </button>

            <button type="button" onClick={handleSubmitTransfer} className="btn btn-primary btn-lg">
              <Check size={18} />
              <span>🚚 Proses Kirim Transfer (In Transit)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
