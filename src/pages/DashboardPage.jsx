import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Boxes,
  Package,
  TrendingUp,
  ArrowLeftRight,
  AlertTriangle,
  Building2,
  Calendar,
  ExternalLink
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';

import { useAuthStore } from '../store/authStore';
import { useInventoryStore } from '../store/inventoryStore';
import { KPICard } from '../components/ui/KPICard';
import { WarehouseHeatmap } from '../components/dashboard/WarehouseHeatmap';
import { RecentActivityFeed } from '../components/dashboard/RecentActivityFeed';
import { Badge } from '../components/ui/Badge';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, isSuperAdmin } = useAuthStore();
  const { warehouses, products, stocks, inbounds, outbounds, transfers, selectedWarehouseFilter } = useInventoryStore();

  // Compute aggregated numbers
  const isFiltered = selectedWarehouseFilter !== 'ALL';
  const activeWh = warehouses.find(w => w.id === selectedWarehouseFilter);

  let totalSkus = products.length;
  let totalStockCount = 0;
  let todayTransactionsCount = 0;
  let activeTransfersCount = transfers.filter(t => t.status === 'In Transit').length;
  let lowStockItems = [];

  products.forEach(p => {
    let pTotal = 0;
    if (isFiltered) {
      pTotal = (stocks[p.id] && stocks[p.id][selectedWarehouseFilter]) || 0;
      if (pTotal <= p.minStock) {
        lowStockItems.push({ ...p, currentStock: pTotal, warehouse: activeWh?.city || selectedWarehouseFilter });
      }
    } else {
      warehouses.forEach(w => {
        const qty = (stocks[p.id] && stocks[p.id][w.id]) || 0;
        pTotal += qty;
        if (qty <= p.minStock) {
          lowStockItems.push({ ...p, currentStock: qty, warehouse: w.city });
        }
      });
    }
    totalStockCount += pTotal;
  });

  todayTransactionsCount = inbounds.length + outbounds.length;

  // Chart 1 Data: Stock Distribution per Warehouse
  const chartStockPerWarehouse = warehouses.map(w => {
    let sum = 0;
    products.forEach(p => {
      sum += (stocks[p.id] && stocks[p.id][w.id]) || 0;
    });
    return { name: w.city, stok: sum, capacity: w.capacity };
  });

  // Chart 2 Data: Weekly Inbound vs Outbound Trend
  const chartTrendData = [
    { day: 'Senin', Masuk: 420, Keluar: 210 },
    { day: 'Selasa', Masuk: 380, Keluar: 310 },
    { day: 'Rabu', Masuk: 510, Keluar: 290 },
    { day: 'Kamis', Masuk: 290, Keluar: 450 },
    { day: 'Jumat', Masuk: 620, Keluar: 380 },
    { day: 'Sabtu', Masuk: 150, Keluar: 220 },
    { day: 'Minggu', Masuk: 90, Keluar: 110 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header Banner */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Dashboard Overviews {isFiltered ? `— Gudang ${activeWh?.name}` : 'Nasional'}
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Monitor real-time arus pergerakan stok barang di 6 lokasi cabang gudang
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => navigate('/app/inventory/inbound')} 
            className="btn btn-success btn-sm"
          >
            + Input Masuk
          </button>
          <button 
            onClick={() => navigate('/app/inventory/outbound')} 
            className="btn btn-danger btn-sm"
          >
            + Input Keluar
          </button>
          <button 
            onClick={() => navigate('/app/transfer/create')} 
            className="btn btn-primary btn-sm"
          >
            + Transfer Baru
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}
      >
        <KPICard
          title="Total SKU Aktif"
          value={totalSkus}
          subtext="Produk terdaftar"
          icon={Package}
          color="#4F6EF7"
          onClick={() => navigate('/app/inventory/stock')}
        />
        <KPICard
          title={isFiltered ? `Stok Gudang ${selectedWarehouseFilter}` : "Stok Total Nasional"}
          value={`${totalStockCount.toLocaleString('id-ID')} pcs`}
          subtext="Akumulasi fisik gudang"
          trend="+4.2%"
          icon={Boxes}
          color="#22C55E"
          onClick={() => navigate('/app/inventory/stock')}
        />
        <KPICard
          title="Transaksi Masuk/Keluar"
          value={todayTransactionsCount}
          subtext="Catatan pergerakan"
          icon={TrendingUp}
          color="#3B82F6"
        />
        <KPICard
          title="Mutasi In-Transit"
          value={activeTransfersCount}
          subtext="Sedang dikirim"
          icon={ArrowLeftRight}
          color="#F59E0B"
          onClick={() => navigate('/app/transfer/list')}
        />
      </div>

      {/* Warehouse Capacity Heatmap */}
      {!isFiltered && (
        <WarehouseHeatmap onSelectWarehouse={() => navigate('/app/inventory/stock')} />
      )}

      {/* Recharts Analytics Section */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 1024 ? '1fr' : '1.2fr 1fr',
          gap: '20px'
        }}
      >
        {/* Bar Chart: Stock Per Warehouse */}
        <div className="glass-panel p-5" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={18} color="var(--primary)" />
            Perbandingan Stok Total Per Gudang (pcs)
          </h3>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartStockPerWarehouse} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-color)', borderRadius: '8px', color: '#fff' }} 
                />
                <Bar dataKey="stok" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart: Weekly Inbound vs Outbound Trend */}
        <div className="glass-panel p-5" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--success)" />
            Tren Pergerakan Barang 7 Hari Terakhir
          </h3>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-color)', borderRadius: '8px', color: '#fff' }} 
                />
                <Legend />
                <Line type="monotone" dataKey="Masuk" stroke="var(--success)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Keluar" stroke="var(--danger)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid: Recent Activity Feed & Low Stock Alert Table */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 1024 ? '1fr' : '1.1fr 1fr',
          gap: '20px'
        }}
      >
        <RecentActivityFeed />

        {/* Low Stock Alert Table Panel */}
        <div className="glass-panel p-5" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="var(--danger)" />
              Low Stock Warning ({lowStockItems.length})
            </h3>
            <button 
              onClick={() => navigate('/app/inventory/stock')} 
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Lihat semua →
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Gudang</th>
                  <th>Stok / Min</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                      ✓ Semua stok berada dalam batas aman
                    </td>
                  </tr>
                ) : (
                  lowStockItems.slice(0, 5).map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.sku}</div>
                      </td>
                      <td>
                        <Badge variant="neutral">{item.warehouse}</Badge>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--danger)' }}>{item.currentStock}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> / {item.minStock} {item.unit}</span>
                      </td>
                      <td>
                        <Badge variant="danger" showDot>Kritis</Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
