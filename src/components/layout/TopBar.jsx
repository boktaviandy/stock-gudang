import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Building2,
  ChevronDown,
  UserCheck,
  Check,
  AlertTriangle,
  Info,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useInventoryStore } from '../../store/inventoryStore';
import { useNotificationStore } from '../../store/notificationStore';
import { INITIAL_USERS } from '../../data/mockData';

export const TopBar = ({ toggleSidebar, setIsMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isSuperAdmin, switchDemoUser } = useAuthStore();
  const { warehouses, selectedWarehouseFilter, setSelectedWarehouseFilter } = useInventoryStore();
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isWhDropdownOpen, setIsWhDropdownOpen] = useState(false);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);
  const whRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotifOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setIsUserMenuOpen(false);
      if (whRef.current && !whRef.current.contains(e.target)) setIsWhDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute Breadcrumb from pathname
  const getBreadcrumbs = () => {
    const parts = location.pathname.split('/').filter(Boolean);
    const pathNamesMap = {
      app: 'Home',
      dashboard: 'Dashboard',
      inventory: 'Manajemen Stok',
      stock: 'Stock Overview',
      inbound: 'Barang Masuk',
      outbound: 'Barang Keluar',
      opname: 'Stock Opname',
      transfer: 'Transfer / Mutasi',
      list: 'Daftar Transfer',
      create: 'Buat Transfer Baru',
      pending: 'Pending Receiving',
      reports: 'Laporan & Audit',
      'stock-ledger': 'Kartu Stok',
      mutation: 'Laporan Mutasi',
      master: 'Master Data',
      products: 'Master Produk',
      warehouses: 'Master Gudang',
      users: 'User Management'
    };

    return parts.map(p => pathNamesMap[p] || p);
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 30
      }}
    >
      {/* Left: Hamburger & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => {
            if (window.innerWidth < 768) {
              setIsMobileOpen(prev => !prev);
            } else {
              toggleSidebar();
            }
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumb Trail */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span>/</span>}
              <span style={{ color: idx === breadcrumbs.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: idx === breadcrumbs.length - 1 ? 600 : 400 }}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right Actions: Warehouse Switcher + Notif Bell + Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Warehouse Selector (Super Admin: Dropdown 6 Gudang, Admin Gudang: Locked) */}
        <div ref={whRef} style={{ position: 'relative' }}>
          {isSuperAdmin() ? (
            <button
              onClick={() => setIsWhDropdownOpen(!isWhDropdownOpen)}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(79, 110, 247, 0.12)',
                border: '1px solid var(--primary-glow)',
                color: 'var(--primary)',
                fontWeight: 600
              }}
            >
              <Building2 size={15} />
              <span>
                {selectedWarehouseFilter === 'ALL'
                  ? '🌐 Semua 6 Gudang'
                  : warehouses.find(w => w.id === selectedWarehouseFilter)?.name || 'Pilih Gudang'}
              </span>
              <ChevronDown size={14} />
            </button>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-color)',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}
            >
              <Building2 size={15} color="var(--warning)" />
              <span>
                {warehouses.find(w => w.id === user?.assignedWarehouse)?.name || 'Gudang Lokasi'}
              </span>
            </div>
          )}

          {/* Super Admin Warehouse Dropdown Menu */}
          {isWhDropdownOpen && isSuperAdmin() && (
            <div
              className="glass-panel-elevated animate-fade-in"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '240px',
                zIndex: 60,
                padding: '8px',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '6px 10px', textTransform: 'uppercase', fontWeight: 700 }}>
                Filter Tampilan Stok
              </div>
              <button
                onClick={() => {
                  setSelectedWarehouseFilter('ALL');
                  setIsWhDropdownOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: selectedWarehouseFilter === 'ALL' ? 'var(--primary)' : 'transparent',
                  color: selectedWarehouseFilter === 'ALL' ? '#fff' : 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  marginBottom: '4px'
                }}
              >
                <span>🌐 Semua 6 Gudang (Global)</span>
                {selectedWarehouseFilter === 'ALL' && <Check size={14} />}
              </button>

              <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }} />

              {warehouses.map(wh => (
                <button
                  key={wh.id}
                  onClick={() => {
                    setSelectedWarehouseFilter(wh.id);
                    setIsWhDropdownOpen(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: selectedWarehouseFilter === wh.id ? 'var(--bg-surface-hover)' : 'transparent',
                    color: selectedWarehouseFilter === wh.id ? 'var(--primary)' : 'var(--text-primary)',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: wh.color }} />
                    <span>{wh.name}</span>
                  </div>
                  {selectedWarehouseFilter === wh.id && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell Dropdown */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--danger)',
                  color: '#fff',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--bg-surface)'
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div
              className="glass-panel-elevated animate-fade-in"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '340px',
                maxHeight: '420px',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 60,
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--bg-surface)'
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  Notifikasi System ({unreadCount})
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsRead()}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Tandai dibaca
                  </button>
                )}
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Tidak ada notifikasi baru
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markAsRead(n.id);
                        if (n.link) navigate(n.link);
                        setIsNotifOpen(false);
                      }}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--border-color)',
                        backgroundColor: n.read ? 'transparent' : 'rgba(79, 110, 247, 0.05)',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '12px',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <div style={{ paddingTop: '2px' }}>
                        {n.type === 'DANGER' && <AlertTriangle size={18} color="var(--danger)" />}
                        {n.type === 'WARNING' && <Info size={18} color="var(--warning)" />}
                        {n.type === 'SUCCESS' && <CheckCircle size={18} color="var(--success)" />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: n.read ? 500 : 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
                          {n.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                          {n.message}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {n.timestamp}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Quick Switch Role Demo Helper */}
        <div ref={userMenuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
              alt={user?.name}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--primary-glow)'
              }}
            />
            <div style={{ textAlign: 'left', display: window.innerWidth < 640 ? 'none' : 'block' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {user?.role}
              </div>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {isUserMenuOpen && (
            <div
              className="glass-panel-elevated animate-fade-in"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '260px',
                zIndex: 60,
                padding: '12px',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <div style={{ paddingBottom: '10px', borderBottom: '1px solid var(--border-color)', marginBottom: '10px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {user?.email}
                </div>
              </div>

              {/* Demo Role Switcher Quick Actions */}
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                ⚡ Quick Switch Demo Account:
              </div>

              {INITIAL_USERS.slice(0, 4).map(u => (
                <button
                  key={u.id}
                  onClick={() => {
                    switchDemoUser(u.id);
                    setIsUserMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: user?.id === u.id ? 'rgba(79, 110, 247, 0.15)' : 'transparent',
                    color: user?.id === u.id ? 'var(--primary)' : 'var(--text-primary)',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    marginBottom: '2px',
                    textAlign: 'left'
                  }}
                >
                  <img src={u.avatar} alt="" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{u.role} ({u.assignedWarehouse || 'HO'})</div>
                  </div>
                  {user?.id === u.id && <Check size={14} color="var(--primary)" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
