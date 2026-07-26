import React, { useState } from 'react';
import { Clock, CheckCircle2, AlertTriangle, ArrowRight, Building2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useInventoryStore } from '../store/inventoryStore';
import { Badge } from '../components/ui/Badge';

export const PendingReceivingPage = () => {
  const { user, isSuperAdmin, getAssignedWarehouse } = useAuthStore();
  const { transfers, warehouses, confirmTransferReceipt } = useInventoryStore();

  const assignedWh = getAssignedWarehouse();

  // Filter transfers that are 'In Transit' and targeted to this warehouse (or all if Super Admin)
  const pendingTransfers = transfers.filter(t => {
    if (t.status !== 'In Transit') return false;
    if (isSuperAdmin()) return true;
    return t.toWarehouse === assignedWh;
  });

  const [receivedMap, setReceivedMap] = useState({});
  const [receiptNotes, setReceiptNotes] = useState('');

  const handleQtyChange = (transferId, productId, qty) => {
    setReceivedMap(prev => ({
      ...prev,
      [transferId]: {
        ...(prev[transferId] || {}),
        [productId]: qty
      }
    }));
  };

  const handleConfirm = (transferId) => {
    const qtyMapForTrf = receivedMap[transferId] || {};
    const res = confirmTransferReceipt(transferId, qtyMapForTrf, receiptNotes, user?.name || 'Admin Penerima');

    if (res.success) {
      alert(`Transfer #${transferId} berhasil dikonfirmasi! Stok gudang tujuan telah bertambah.`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Clock size={24} color="var(--warning)" />
          Pending Receiving (Konfirmasi Penerimaan Transfer)
        </h1>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          Verifikasi fisik barang yang tiba di gudang tujuan dan konfirmasi untuk menambahkan stok
        </p>
      </div>

      {pendingTransfers.length === 0 ? (
        <div className="glass-panel p-5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <CheckCircle2 size={40} color="var(--success)" style={{ marginBottom: '12px' }} />
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>Tidak Ada Transfer Pending</h3>
          <p style={{ fontSize: '0.85rem' }}>Semua pengiriman mutasi antar gudang telah diterima dan dikonfirmasi.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {pendingTransfers.map(trf => {
            const fromWh = warehouses.find(w => w.id === trf.fromWarehouse);
            const toWh = warehouses.find(w => w.id === trf.toWarehouse);

            return (
              <div key={trf.id} className="glass-panel p-5" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                      {trf.id}
                    </div>
                    <Badge variant="warning" showDot>IN TRANSIT</Badge>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Dikirim: <strong>{trf.date}</strong> oleh <strong>{trf.createdBy}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>
                  <span>📍 Gudang {fromWh?.city}</span>
                  <ArrowRight size={18} color="var(--primary)" />
                  <span style={{ color: 'var(--primary)' }}>📍 Gudang {toWh?.city}</span>
                </div>

                {trf.notes && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px', fontStyle: 'italic' }}>
                    Catatan pengirim: "{trf.notes}"
                  </div>
                )}

                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '10px' }}>Verifikasi Fisik Jumlah Diterima:</h4>
                <div className="table-container" style={{ marginBottom: '16px' }}>
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Produk SKU</th>
                        <th>Jumlah Dikirim</th>
                        <th>Jumlah Fisik Diterima (Input)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trf.items.map(item => {
                        const currentInput = (receivedMap[trf.id] && receivedMap[trf.id][item.productId]) !== undefined
                          ? receivedMap[trf.id][item.productId]
                          : item.qty;

                        return (
                          <tr key={item.productId}>
                            <td>
                              <div style={{ fontWeight: 600 }}>{item.name}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.sku}</div>
                            </td>
                            <td style={{ fontWeight: 700 }}>
                              {item.qty} pcs
                            </td>
                            <td style={{ width: '180px' }}>
                              <input
                                type="number"
                                className="form-control"
                                style={{ textAlign: 'center', fontWeight: 700 }}
                                min="0"
                                value={currentInput}
                                onChange={(e) => handleQtyChange(trf.id, item.productId, e.target.value)}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => handleConfirm(trf.id)}
                    className="btn btn-success btn-lg"
                  >
                    <CheckCircle2 size={18} />
                    <span>✓ Konfirmasi Diterima (Stok Gudang +)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
