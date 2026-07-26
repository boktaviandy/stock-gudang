import React, { useState } from 'react';
import { Package, Plus, Edit, Search, Check, FolderPlus, Tag } from 'lucide-react';
import { useInventoryStore } from '../store/inventoryStore';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

export const ProductMasterPage = () => {
  const { products, categories, addProduct, updateProduct, addCategory } = useInventoryStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [newCatInput, setNewCatInput] = useState('');
  const [catError, setCatError] = useState('');

  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: categories[0] || 'Kabel & Konektor',
    unit: 'Pcs',
    minStock: 15,
    description: '',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150'
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      sku: `SKU-${Date.now().toString().slice(-4)}`,
      name: '',
      category: categories[0] || 'Kabel & Konektor',
      unit: 'Pcs',
      minStock: 15,
      description: '',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData(prod);
    setIsModalOpen(true);
  };

  const handleSubmitProduct = (e) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct({ ...formData, id: editingProduct.id });
    } else {
      addProduct(formData);
    }
    setIsModalOpen(false);
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    setCatError('');
    const res = addCategory(newCatInput);
    if (res.success) {
      setFormData(prev => ({ ...prev, category: res.name }));
      setNewCatInput('');
      setIsCatModalOpen(false);
    } else {
      setCatError(res.error || 'Gagal menambahkan kategori');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCatFilter === 'ALL' || p.category === selectedCatFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package size={24} color="var(--primary)" />
            Katalog Produk & Kategori Barang
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Kelola catalog SKU produk, tambah kategori barang baru, dan atur ambang minimum stok
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setIsCatModalOpen(true)} className="btn btn-secondary">
            <FolderPlus size={18} color="var(--primary)" />
            <span>+ Kategori Baru</span>
          </button>

          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={18} />
            <span>+ Tambah Produk Baru</span>
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="glass-panel p-4" style={{ padding: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '38px' }}
            placeholder="Cari SKU atau nama produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        <select
          className="form-select"
          style={{ width: '220px' }}
          value={selectedCatFilter}
          onChange={(e) => setSelectedCatFilter(e.target.value)}
        >
          <option value="ALL">Semua Kategori ({categories.length})</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="table-container glass-panel">
        <table className="custom-table">
          <thead>
            <tr>
              <th>SKU & Produk</th>
              <th>Kategori Barang</th>
              <th>Satuan</th>
              <th>Minimum Stok</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(prod => (
              <tr key={prod.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={prod.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{prod.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{prod.sku}</div>
                    </div>
                  </div>
                </td>
                <td><Badge variant="neutral">{prod.category}</Badge></td>
                <td style={{ fontSize: '0.85rem' }}>{prod.unit}</td>
                <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>{prod.minStock} {prod.unit}</td>
                <td><Badge variant="success" showDot>Aktif</Badge></td>
                <td style={{ textAlign: 'center' }}>
                  <button onClick={() => handleOpenEdit(prod)} className="btn btn-secondary btn-sm">
                    <Edit size={14} />
                    <span>Edit</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: TAMBAH / EDIT PRODUK */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? `Edit Produk: ${editingProduct.name}` : 'Tambah Produk Baru'}
      >
        <form onSubmit={handleSubmitProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Kode SKU *</label>
            <input
              type="text"
              className="form-control"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nama Produk *</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Kategori Barang *</label>
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(true)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  + Kategori Baru
                </button>
              </div>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Satuan Unit *</label>
              <select
                className="form-select"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              >
                <option value="Pcs">Pcs</option>
                <option value="Unit">Unit</option>
                <option value="Roll">Roll</option>
                <option value="Box">Box</option>
                <option value="Kg">Kg</option>
                <option value="Meter">Meter</option>
                <option value="Set">Set</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Minimum Stok Safety Threshold *</label>
            <input
              type="number"
              className="form-control"
              value={formData.minStock}
              onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi Singkat</label>
            <textarea
              className="form-control"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>{editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: TAMBAH KATEGORI BARU */}
      <Modal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        title="🏷️ Tambah Kategori Barang Baru"
        maxWidth="450px"
      >
        <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {catError && (
            <div style={{ padding: '10px', borderRadius: '6px', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', fontSize: '0.85rem' }}>
              ⚠ {catError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Nama Kategori Baru *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Contoh: Komponen Listrik, ATK Gudang, Sparepart..."
              value={newCatInput}
              onChange={(e) => setNewCatInput(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Kategori yang ditambahkan akan dapat langsung digunakan oleh seluruh Admin Gudang saat menginput produk baru.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button type="button" onClick={() => setIsCatModalOpen(false)} className="btn btn-secondary">
              Batal
            </button>
            <button type="submit" className="btn btn-success">
              <Check size={16} />
              <span>Simpan Kategori</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
