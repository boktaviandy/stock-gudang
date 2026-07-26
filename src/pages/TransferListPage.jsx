import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, Plus, Search, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useInventoryStore } from '../store/inventoryStore';
import { Badge } from '../components/ui/Badge';

export const TransferListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { transfers, warehouses } = useInventoryStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL'); // ALL, In Transit, Received, Draft

  const filteredTransfers = transfers.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(searchQuery.toLowerCase()) || t.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ArrowLeftRight size={24} color="var(--warning)" />
            Mutasi & Transfer Antar Gudang
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Daftar riwayat pengiriman stok antar 6 cabang lokasi gudang
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/app/transfer/pending')}
            className="btn btn-secondary"
          >
            <Clock size={16} color="var(--warning)" />
            <span>Pending Receiving</span>
          </button>

          <button
            onClick={() => navigate('/app/transfer/create')}
            className="btn btn-primary"
          >
            <Plus size={18} />
            <span>+ Buat Transfer Baru</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4" style={{ padding: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '38px' }}
            placeholder="Cari No Transfer / Pembuat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        <select
          className="form-select"
          style={{ width: '180px' }}
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="ALL">Semua Status</option>
          <option value="In Transit">🟡 In Transit (Dikirim)</option>
          <option value="Received">🟢 Received (Selesai)</option>
          <option value="Draft">⬜ Draft</option>
        </select>
      </div>

      {/* Transfer List Table */}
      <div className="table-container glass-panel">
        <table className="custom-table">
          <thead>
            <tr>
              <th>No. Transfer</th>
              <th>Tanggal</th>
              <th>Dari Gudang</th>
              <th>Ke Gudang</th>
              <th>Detail Item & Jumlah</th>
              <th>Status Transaksi</th>
              <th>Dibuat Oleh</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransfers.map(trf => {
              const fromWh = warehouses.find(w => w.id === trf.fromWarehouse);
              const toWh = warehouses.find(w => w.id === trf.toWarehouse);
              const totalItemsCount = trf.items.reduce((acc, item) => acc + Number(item.qty), 0);

              let statusVariant = 'warning';
              if (trf.status === 'Received') statusVariant = 'success';
              if (trf.status === 'Draft') statusVariant = 'neutral';

              return (
                <tr key={trf.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                      {trf.id}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{trf.date}</td>
                  <td>
                    <Badge variant="neutral">📍 {fromWh?.city || trf.fromWarehouse}</Badge>
                  </td>
                  <td>
                    <Badge variant="info">📍 {toWh?.city || trf.toWarehouse}</Badge>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>
                      {trf.items.length} produk ({totalItemsCount} pcs)
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {trf.items.map(i => `${i.name} (${i.qty} pcs)`).join(', ')}
                    </div>
                  </td>
                  <td>
                    <Badge variant={statusVariant} showDot>
                      {trf.status}
                    </Badge>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {trf.createdBy}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
