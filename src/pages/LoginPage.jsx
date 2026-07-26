import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Building2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { INITIAL_USERS } from '../data/mockData';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, switchDemoUser } = useAuthStore();

  const [email, setEmail] = useState('superadmin@stockhq.id');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsSubmitting(false);

      if (res.success) {
        navigate('/app/dashboard');
      } else {
        setErrorMsg(res.error || 'Login gagal');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    }, 400);
  };

  const handleQuickLogin = (usr) => {
    switchDemoUser(usr.id);
    navigate('/app/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--bg-dark)' }}>
      {/* Left Column — Visual Branding */}
      <div 
        style={{
          flex: 1.2,
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-color)',
          padding: '48px',
          display: window.innerWidth < 900 ? 'none' : 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background glow effects */}
        <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,110,247,0.15) 0%, rgba(0,0,0,0) 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, rgba(0,0,0,0) 70%)' }} />

        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 10 }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.4rem', boxShadow: '0 4px 16px var(--primary-glow)' }}>
            S
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>StockHQ</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Multi-Warehouse Inventory System</p>
          </div>
        </div>

        {/* Center Visual Content */}
        <div style={{ zIndex: 10, maxWidth: '480px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '16px', letterSpacing: '-0.03em' }}>
            Kontrol Stok Real-time untuk 6 Gudang Cabang.
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px' }}>
            Platform terpadu untuk monitoring inventori nasional, transaksi barang masuk/keluar, dan transfer antar-gudang secara presisi dengan Role-Based Access Control.
          </p>

          {/* 6 Warehouses badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[
              { code: 'JKT', name: 'Jakarta (HQ)', color: '#4F6EF7' },
              { code: 'DPS', name: 'Bali', color: '#F59E0B' },
              { code: 'LOP', name: 'Lombok', color: '#EF4444' },
              { code: 'UPG', name: 'Sulawesi', color: '#22C55E' },
              { code: 'SRG', name: 'Jawa Tengah', color: '#3B82F6' },
              { code: 'JOG', name: 'Jogja', color: '#8B5CF6' }
            ].map(w => (
              <div 
                key={w.code} 
                className="glass-panel"
                style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: w.color }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{w.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="var(--success)" />
          <span>Sistem Keamanan Terenkripsi & Enterprise Audit Trail</span>
        </div>
      </div>

      {/* Right Column — Login Form */}
      <div 
        style={{
          flex: 1,
          padding: '48px 32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div className={shake ? 'animate-shake' : ''} style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Selamat Datang
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Masukkan akun terdaftar Anda untuk mengelola stok gudang
            </p>
          </div>

          {errorMsg && (
            <div 
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--danger-bg)',
                border: '1px solid var(--danger-border)',
                color: 'var(--danger)',
                fontSize: '0.85rem',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>⚠ {errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email / Username</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: '40px' }}
                  placeholder="name@stockhq.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: '40px' }}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: '28px' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Memproses...</span>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Preset Helper */}
          <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', uppercase: true, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              💡 Quick Demo Account Selector (Pilih Role):
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {INITIAL_USERS.slice(0, 4).map(usr => (
                <button
                  key={usr.id}
                  onClick={() => handleQuickLogin(usr)}
                  className="glass-panel"
                  style={{
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={usr.avatar} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{usr.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{usr.role} ({usr.assignedWarehouse || 'All Gudang'})</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>Pilih →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
