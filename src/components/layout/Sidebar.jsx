import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  ArrowDownLeft,
  ArrowUpRight,
  ClipboardCheck,
  ArrowLeftRight,
  PlusCircle,
  Clock,
  FileText,
  History,
  Package,
  Warehouse,
  Users,
  ChevronDown,
  ChevronRight,
  LogOut,
  ShieldAlert,
  Building2,
  Tag
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useInventoryStore } from '../../store/inventoryStore';

export const Sidebar = ({ isCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const { user, isSuperAdmin, logout } = useAuthStore();
  const { warehouses } = useInventoryStore();

  const assignedWh = warehouses.find(w => w.id === user?.assignedWarehouse);

  // Accordion states
  const [openSections, setOpenSections] = useState({
    inventory: true,
    transfer: true,
    reports: false,
    master: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const closeMobile = () => {
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={closeMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 17, 23, 0.8)',
            backdropFilter: 'blur(4px)',
            zIndex: 40
          }}
        />
      )}

      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: isCollapsed ? '72px' : '260px',
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-color)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isMobileOpen ? 'translateX(0)' : (window.innerWidth < 768 ? 'translateX(-100%)' : 'translateX(0)')
        }}
      >
        {/* Brand Header */}
        <div 
          style={{
            height: '64px',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-surface)'
          }}
        >
          <div 
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem',
              boxShadow: '0 2px 10px var(--primary-glow)',
              flexShrink: 0
            }}
          >
            S
          </div>

          {!isCollapsed && (
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                StockHQ
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Multi-Warehouse System
              </div>
            </div>
          )}
        </div>

        {/* User Warehouse Context Badge */}
        {!isCollapsed && (
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
            <div 
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <Building2 size={16} color={assignedWh?.color || 'var(--primary)'} />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {isSuperAdmin() ? 'Akses Role' : 'Lokasi Gudang'}
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {isSuperAdmin() ? 'Super Admin (HO)' : (assignedWh ? assignedWh.name : 'Gudang Assigned')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav Items Container */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
          {/* Main Dashboard */}
          <NavLink
            to="/app/dashboard"
            onClick={closeMobile}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: isCollapsed ? '12px 0' : '10px 14px',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              borderRadius: 'var(--radius-sm)',
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'rgba(79, 110, 247, 0.12)' : 'transparent',
              fontWeight: isActive ? 600 : 500,
              fontSize: '0.9rem',
              textDecoration: 'none',
              marginBottom: '4px'
            })}
          >
            <LayoutDashboard size={18} />
            {!isCollapsed && <span>Dashboard</span>}
          </NavLink>

          {/* SECTION: MANAJEMEN STOK */}
          <div style={{ marginTop: '12px' }}>
            {!isCollapsed && (
              <button
                onClick={() => toggleSection('inventory')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 14px',
                  background: 'none',
                  border: 'none',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: 'pointer'
                }}
              >
                <span>Manajemen Stok</span>
                {openSections.inventory ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            )}

            {(openSections.inventory || isCollapsed) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                <NavLink
                  to="/app/inventory/stock"
                  onClick={closeMobile}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: isCollapsed ? '10px 0' : '9px 14px 9px 24px',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    borderRadius: 'var(--radius-sm)',
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'rgba(79, 110, 247, 0.12)' : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.86rem',
                    textDecoration: 'none'
                  })}
                >
                  <Boxes size={16} />
                  {!isCollapsed && <span>Stock Overview</span>}
                </NavLink>

                <NavLink
                  to="/app/master/products"
                  onClick={closeMobile}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: isCollapsed ? '10px 0' : '9px 14px 9px 24px',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    borderRadius: 'var(--radius-sm)',
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'rgba(79, 110, 247, 0.12)' : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.86rem',
                    textDecoration: 'none'
                  })}
                >
                  <Package size={16} />
                  {!isCollapsed && <span>Katalog & Kategori</span>}
                </NavLink>

                <NavLink
                  to="/app/inventory/inbound"
                  onClick={closeMobile}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: isCollapsed ? '10px 0' : '9px 14px 9px 24px',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    borderRadius: 'var(--radius-sm)',
                    color: isActive ? 'var(--success)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--success-bg)' : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.86rem',
                    textDecoration: 'none'
                  })}
                >
                  <ArrowDownLeft size={16} color={location.pathname === '/app/inventory/inbound' ? 'var(--success)' : undefined} />
                  {!isCollapsed && <span>Barang Masuk</span>}
                </NavLink>

                <NavLink
                  to="/app/inventory/outbound"
                  onClick={closeMobile}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: isCollapsed ? '10px 0' : '9px 14px 9px 24px',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    borderRadius: 'var(--radius-sm)',
                    color: isActive ? 'var(--danger)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--danger-bg)' : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.86rem',
                    textDecoration: 'none'
                  })}
                >
                  <ArrowUpRight size={16} color={location.pathname === '/app/inventory/outbound' ? 'var(--danger)' : undefined} />
                  {!isCollapsed && <span>Barang Keluar</span>}
                </NavLink>

                <NavLink
                  to="/app/inventory/opname"
                  onClick={closeMobile}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: isCollapsed ? '10px 0' : '9px 14px 9px 24px',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    borderRadius: 'var(--radius-sm)',
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'rgba(79, 110, 247, 0.12)' : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.86rem',
                    textDecoration: 'none'
                  })}
                >
                  <ClipboardCheck size={16} />
                  {!isCollapsed && <span>Stock Opname</span>}
                </NavLink>
              </div>
            )}
          </div>

          {/* SECTION: TRANSFER / MUTASI */}
          <div style={{ marginTop: '12px' }}>
            {!isCollapsed && (
              <button
                onClick={() => toggleSection('transfer')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 14px',
                  background: 'none',
                  border: 'none',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: 'pointer'
                }}
              >
                <span>Transfer & Mutasi</span>
                {openSections.transfer ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            )}

            {(openSections.transfer || isCollapsed) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                <NavLink
                  to="/app/transfer/list"
                  onClick={closeMobile}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: isCollapsed ? '10px 0' : '9px 14px 9px 24px',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    borderRadius: 'var(--radius-sm)',
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'rgba(79, 110, 247, 0.12)' : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.86rem',
                    textDecoration: 'none'
                  })}
                >
                  <ArrowLeftRight size={16} />
                  {!isCollapsed && <span>Daftar Transfer</span>}
                </NavLink>

                <NavLink
                  to="/app/transfer/create"
                  onClick={closeMobile}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: isCollapsed ? '10px 0' : '9px 14px 9px 24px',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    borderRadius: 'var(--radius-sm)',
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'rgba(79, 110, 247, 0.12)' : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.86rem',
                    textDecoration: 'none'
                  })}
                >
                  <PlusCircle size={16} />
                  {!isCollapsed && <span>Buat Transfer</span>}
                </NavLink>

                <NavLink
                  to="/app/transfer/pending"
                  onClick={closeMobile}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: isCollapsed ? '10px 0' : '9px 14px 9px 24px',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    borderRadius: 'var(--radius-sm)',
                    color: isActive ? 'var(--warning)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--warning-bg)' : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.86rem',
                    textDecoration: 'none'
                  })}
                >
                  <Clock size={16} color={location.pathname === '/app/transfer/pending' ? 'var(--warning)' : undefined} />
                  {!isCollapsed && <span>Pending Receive</span>}
                </NavLink>
              </div>
            )}
          </div>

          {/* SECTION: LAPORAN */}
          <div style={{ marginTop: '12px' }}>
            {!isCollapsed && (
              <button
                onClick={() => toggleSection('reports')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 14px',
                  background: 'none',
                  border: 'none',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: 'pointer'
                }}
              >
                <span>Laporan & Audit</span>
                {openSections.reports ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            )}

            {(openSections.reports || isCollapsed) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                <NavLink
                  to="/app/reports/stock-ledger"
                  onClick={closeMobile}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: isCollapsed ? '10px 0' : '9px 14px 9px 24px',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    borderRadius: 'var(--radius-sm)',
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'rgba(79, 110, 247, 0.12)' : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.86rem',
                    textDecoration: 'none'
                  })}
                >
                  <FileText size={16} />
                  {!isCollapsed && <span>Kartu Stok</span>}
                </NavLink>

                <NavLink
                  to="/app/reports/mutation"
                  onClick={closeMobile}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: isCollapsed ? '10px 0' : '9px 14px 9px 24px',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    borderRadius: 'var(--radius-sm)',
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'rgba(79, 110, 247, 0.12)' : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.86rem',
                    textDecoration: 'none'
                  })}
                >
                  <History size={16} />
                  {!isCollapsed && <span>Laporan Mutasi</span>}
                </NavLink>
              </div>
            )}
          </div>

          {/* SECTION: MASTER DATA (Super Admin Only for Warehouses & Users) */}
          {isSuperAdmin() && (
            <div style={{ marginTop: '12px' }}>
              {!isCollapsed && (
                <button
                  onClick={() => toggleSection('master')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 14px',
                    background: 'none',
                    border: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer'
                  }}
                >
                  <span>Pengaturan System</span>
                  {openSections.master ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              )}

              {(openSections.master || isCollapsed) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                  <NavLink
                    to="/app/master/warehouses"
                    onClick={closeMobile}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: isCollapsed ? '10px 0' : '9px 14px 9px 24px',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      borderRadius: 'var(--radius-sm)',
                      color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                      backgroundColor: isActive ? 'rgba(79, 110, 247, 0.12)' : 'transparent',
                      fontWeight: isActive ? 600 : 400,
                      fontSize: '0.86rem',
                      textDecoration: 'none'
                    })}
                  >
                    <Warehouse size={16} />
                    {!isCollapsed && <span>Master Gudang</span>}
                  </NavLink>

                  <NavLink
                    to="/app/master/users"
                    onClick={closeMobile}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: isCollapsed ? '10px 0' : '9px 14px 9px 24px',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      borderRadius: 'var(--radius-sm)',
                      color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                      backgroundColor: isActive ? 'rgba(79, 110, 247, 0.12)' : 'transparent',
                      fontWeight: isActive ? 600 : 400,
                      fontSize: '0.86rem',
                      textDecoration: 'none'
                    })}
                  >
                    <Users size={16} />
                    {!isCollapsed && <span>User Management</span>}
                  </NavLink>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer User Info / Logout */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={() => logout()}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              padding: '10px 12px',
              background: 'none',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--danger)',
              cursor: 'pointer',
              fontSize: '0.86rem',
              fontWeight: 500
            }}
          >
            <LogOut size={16} />
            {!isCollapsed && <span>Keluar System</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
