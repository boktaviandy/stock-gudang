import React, { useState } from 'react';
import { Users, Plus, ShieldCheck, UserCheck, Edit } from 'lucide-react';
import { useInventoryStore } from '../store/inventoryStore';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

export const UserManagementPage = () => {
  const { users, warehouses, addUser, updateUser } = useInventoryStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Admin Gudang',
    assignedWarehouse: 'JKT',
    password: 'password123'
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'Admin Gudang',
      assignedWarehouse: 'JKT',
      password: 'password123'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u) => {
    setEditingUser(u);
    setFormData(u);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      updateUser({ ...formData, id: editingUser.id });
    } else {
      addUser(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={24} color="var(--primary)" />
            User Management & Role Access Control (RBAC)
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Kelola akun pengguna, peran Super Admin (HO), dan penugasan akses Admin Gudang per cabang
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} />
          <span>+ Tambah Akun User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="table-container glass-panel">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Pengguna</th>
              <th>Email</th>
              <th>Role Pengguna</th>
              <th>Penugasan Gudang</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => {
              const wh = warehouses.find(w => w.id === u.assignedWarehouse);
              const isSuper = u.role === 'Super Admin';

              return (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={u.avatar} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{u.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td>
                    {isSuper ? (
                      <Badge variant="primary" showDot>♛ Super Admin (HO)</Badge>
                    ) : (
                      <Badge variant="info" showDot>Admin Gudang</Badge>
                    )}
                  </td>
                  <td>
                    {isSuper ? (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>🌐 Access All 6 Gudang</span>
                    ) : (
                      <Badge variant="warning">📍 Gudang {wh?.city || u.assignedWarehouse}</Badge>
                    )}
                  </td>
                  <td><Badge variant="success" showDot>Aktif</Badge></td>
                  <td style={{ textAlign: 'center' }}>
                    <button onClick={() => handleOpenEdit(u)} className="btn btn-secondary btn-sm">
                      <Edit size={14} />
                      <span>Edit Role</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal CRUD */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? `Edit User: ${editingUser.name}` : 'Tambah User Baru'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Nama Lengkap *</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Akun *</label>
            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role Akses Pengguna *</label>
            <select
              className="form-select"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="Admin Gudang">Admin Gudang (Staff Per Lokasi)</option>
              <option value="Super Admin">Super Admin (Pemilik / Tim HO)</option>
            </select>
          </div>

          {formData.role === 'Admin Gudang' && (
            <div className="form-group">
              <label className="form-label">Penugasan Lokasi Gudang (Location Lock) *</label>
              <select
                className="form-select"
                value={formData.assignedWarehouse}
                onChange={(e) => setFormData({ ...formData, assignedWarehouse: e.target.value })}
              >
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>📍 Gudang {w.city} ({w.name})</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan User
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
