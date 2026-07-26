import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Boxes,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  FileText,
  AlertTriangle,
  Building2,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useInventoryStore } from '../store/inventoryStore';
import { Badge } from '../components/ui/Badge';
import { Drawer } from '../components/ui/Drawer';

export const StockOverviewPage = () => {
  const navigate = useNavigate();
  const { isSuperAdmin, getAssignedWarehouse } = useAuthStore();
  const { products, warehouses, stocks, selectedWarehouseFilter, setSelectedWarehouseFilter } = useInventoryStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);

  const categories = ['ALL', ...new Set(products.map(p => p.category))];

  const assignedWh = getAssignedWarehouse();

  // Filter products logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;

    // Compute stock status
    let totalStock = 0;
    if (selectedWarehouseFilter !== 'ALL') {
      totalStock = (stocks[p.id] && stocks[p.id][selectedWarehouseFilter]) || 0;
    } else {
      warehouses.forEach(w => {
        totalStock += (stocks[p.id] && stocks[p.id][w.id]) || 0;
      });
    }

    const isLow = totalStock <= p.minStock;
    const matchesStatus = selectedStatus === 'ALL' || (selectedStatus === 'LOW' && isLow) || (selectedStatus === 'NORMAL' && !isLow);

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Stock Overview Nasional
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Daftar lengkap ketersediaan stok produk per unit gudang cabang
          </p>
        </div>

        {/* Warehouse Selector Button */}
        {isSuperAdmin() && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Filter Gudang:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '6px 12px' }}
              value={selectedWarehouseFilter}
              onChange={(e) => setSelectedWarehouseFilter(e.target.value)}
            >
              <option value="ALL">🌐 Semuanya (6 Gudang)</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>📍 Gudang {w.city} ({w.id})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div 
        className="glass-panel p-4"
        style={{
          padding: '16px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px' }}>
          {/* Search bar */}
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '38px' }}
              placeholder="Cari berdasarkan SKU atau Nama Produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Category Filter */}
          <select
            className="form-select"
            style={{ width: '180px' }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="ALL">Semua Kategori</option>
            {categories.filter(c => c !== 'ALL').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="form-select"
            style={{ width: '150px' }}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="ALL">Semua Status</option>
            <option value="LOW">🔴 Low / Kritis</option>
            <option value="NORMAL">🟢 Normal</option>
          </select>
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Menampilkan <strong style={{ color: 'var(--text-primary)' }}>{filteredProducts.length}</strong> produk
        </div>
      </div>

      {/* Main Stock Table */}
      <div className="table-container glass-panel">
        <table className="custom-table">
          <thead>
            <tr>
              <th>SKU & Produk</th>
              <th>Kategori</th>
              <th>Satuan</th>
              {/* Stock columns per warehouse */}
              {warehouses.map(w => (
                <th key={w.id} style={{ textAlign: 'center', backgroundColor: selectedWarehouseFilter === w.id ? 'rgba(79,110,247,0.15)' : undefined }}>
                  {w.id}
                </th>
              ))}
              <th style={{ textAlign: 'center' }}>Total Stok</th>
              <th style={{ textAlign: 'center' }}>Min. Stok</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(prod => {
              // Calculate total stock across warehouses
              let totalQty = 0;
              const whStockMap = {};

              warehouses.forEach(w => {
                const qty = (stocks[prod.id] && stocks[prod.id][w.id]) || 0;
                whStockMap[w.id] = qty;
                totalQty += qty;
              });

              const isLow = totalQty <= prod.minStock;

              return (
                <tr 
                  key={prod.id}
                  onClick={() => setSelectedProductDetail(prod)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={prod.image}
                        alt={prod.name}
                        style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                          {prod.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          {prod.sku}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge variant="neutral">{prod.category}</Badge>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {prod.unit}
                  </td>

                  {/* Stock values per warehouse */}
                  {warehouses.map(w => {
                    const q = whStockMap[w.id];
                    const isWLow = q <= Math.ceil(prod.minStock / 3);
                    return (
                      <td 
                        key={w.id} 
                        style={{ 
                          textAlign: 'center', 
                          fontWeight: 600,
                          backgroundColor: selectedWarehouseFilter === w.id ? 'rgba(79,110,247,0.08)' : undefined,
                          color: isWLow ? 'var(--danger)' : 'var(--text-primary)'
                        }}
                      >
                        {q}
                        {isWLow && <span style={{ fontSize: '0.7rem', display: 'block', color: 'var(--danger)' }}>⚠ low</span>}
                      </td>
                    );
                  })}

                  <td style={{ textAlign: 'center', fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {totalQty}
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {prod.minStock}
                  </td>
                  <td>
                    {isLow ? (
                      <Badge variant="danger" showDot>Kritis</Badge>
                    ) : (
                      <Badge variant="success" showDot>Normal</Badge>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProductDetail(prod);
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Slide-over Detail Panel */}
      <Drawer
        isOpen={Boolean(selectedProductDetail)}
        onClose={() => setSelectedProductDetail(null)}
        title={selectedProductDetail ? `Detail Stok: ${selectedProductDetail.name}` : ''}
        width="480px"
      >
        {selectedProductDetail && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header info */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <img
                src={selectedProductDetail.image}
                alt=""
                style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover' }}
              />
              <div>
                <Badge variant="neutral" style={{ marginBottom: '4px' }}>{selectedProductDetail.category}</Badge>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {selectedProductDetail.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  {selectedProductDetail.sku} • Min. Stock: {selectedProductDetail.minStock} {selectedProductDetail.unit}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {selectedProductDetail.description}
            </p>

            {/* Breakdown Stock Per Warehouse */}
            <div className="glass-panel p-4" style={{ padding: '16px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={16} color="var(--primary)" />
                Sebaran Stok 6 Cabang Gudang
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {warehouses.map(w => {
                  const q = (stocks[selectedProductDetail.id] && stocks[selectedProductDetail.id][w.id]) || 0;
                  const isWLow = q <= Math.ceil(selectedProductDetail.minStock / 3);

                  return (
                    <div key={w.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: w.color }} />
                        <span style={{ fontWeight: 500 }}>{w.name} ({w.city})</span>
                      </div>
                      <div style={{ fontWeight: 700, color: isWLow ? 'var(--danger)' : 'var(--text-primary)' }}>
                        {q} {selectedProductDetail.unit} {isWLow && '⚠'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions Button Group */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', uppercase: true }}>
                Aksi Cepat Inventori:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  onClick={() => {
                    setSelectedProductDetail(null);
                    navigate('/app/inventory/inbound');
                  }}
                  className="btn btn-success"
                >
                  <ArrowDownLeft size={16} />
                  <span>+ Barang Masuk</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedProductDetail(null);
                    navigate('/app/inventory/outbound');
                  }}
                  className="btn btn-danger"
                >
                  <ArrowUpRight size={16} />
                  <span>- Barang Keluar</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedProductDetail(null);
                    navigate('/app/transfer/create');
                  }}
                  className="btn btn-primary"
                >
                  <ArrowLeftRight size={16} />
                  <span>Buat Transfer</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedProductDetail(null);
                    navigate('/app/reports/stock-ledger');
                  }}
                  className="btn btn-secondary"
                >
                  <FileText size={16} />
                  <span>Kartu Stok</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
