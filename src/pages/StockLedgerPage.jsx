import React, { useState } from 'react';
import { FileText, Download, Filter, Search, Building2, Package } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

import { useInventoryStore } from '../store/inventoryStore';
import { Badge } from '../components/ui/Badge';

export const StockLedgerPage = () => {
  const { warehouses, products, inbounds, outbounds, transfers, opnames, stocks } = useInventoryStore();

  const [selectedWarehouse, setSelectedWarehouse] = useState(warehouses[0]?.id || 'JKT');
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || 'PROD-001');

  const currentProd = products.find(p => p.id === selectedProduct);
  const currentWh = warehouses.find(w => w.id === selectedWarehouse);

  // Compute Kartu Stok running ledger entries
  const getLedgerEntries = () => {
    const entries = [];

    // 1. Inbounds
    inbounds.forEach(inb => {
      if (inb.warehouseId === selectedWarehouse) {
        inb.items.forEach(item => {
          if (item.productId === selectedProduct) {
            entries.push({
              date: inb.date,
              type: 'INBOUND',
              ref: inb.refNo,
              qtyIn: Number(item.qty),
              qtyOut: 0,
              actor: inb.createdBy,
              notes: `Pemasok: ${inb.supplier}`
            });
          }
        });
      }
    });

    // 2. Outbounds
    outbounds.forEach(outb => {
      if (outb.warehouseId === selectedWarehouse) {
        outb.items.forEach(item => {
          if (item.productId === selectedProduct) {
            entries.push({
              date: outb.date,
              type: 'OUTBOUND',
              ref: outb.refNo,
              qtyIn: 0,
              qtyOut: Number(item.qty),
              actor: outb.createdBy,
              notes: `Tujuan: ${outb.customer} (${outb.reason})`
            });
          }
        });
      }
    });

    // 3. Transfers Out & In
    transfers.forEach(trf => {
      if (trf.fromWarehouse === selectedWarehouse) {
        trf.items.forEach(item => {
          if (item.productId === selectedProduct) {
            entries.push({
              date: trf.date,
              type: 'TRANSFER_OUT',
              ref: trf.id,
              qtyIn: 0,
              qtyOut: Number(item.qty),
              actor: trf.createdBy,
              notes: `Mutasi Keluar ke Gudang ${trf.toWarehouse}`
            });
          }
        });
      }
      if (trf.toWarehouse === selectedWarehouse && trf.status === 'Received') {
        trf.items.forEach(item => {
          if (item.productId === selectedProduct) {
            entries.push({
              date: trf.date,
              type: 'TRANSFER_IN',
              ref: trf.id,
              qtyIn: Number(item.qty),
              qtyOut: 0,
              actor: trf.receivedBy || 'Admin Gudang',
              notes: `Mutasi Masuk dari Gudang ${trf.fromWarehouse}`
            });
          }
        });
      }
    });

    // Sort by date ascending to calculate running total
    entries.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate running balance
    let runningBalance = 10; // Initial base seed
    const ledgerWithBalance = entries.map(entry => {
      runningBalance = runningBalance + entry.qtyIn - entry.qtyOut;
      return {
        ...entry,
        balance: runningBalance
      };
    });

    return ledgerWithBalance;
  };

  const ledgerData = getLedgerEntries();
  const currentActualStock = (stocks[selectedProduct] && stocks[selectedProduct][selectedWarehouse]) || 0;

  // Export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Kartu Stok — ${currentProd?.name}`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Gudang: ${currentWh?.name} (${currentWh?.city}) | SKU: ${currentProd?.sku}`, 14, 22);

    const tableRows = ledgerData.map(row => [
      row.date,
      row.type,
      row.ref,
      row.qtyIn > 0 ? `+${row.qtyIn}` : '-',
      row.qtyOut > 0 ? `-${row.qtyOut}` : '-',
      row.balance,
      row.actor
    ]);

    doc.autoTable({
      head: [['Tanggal', 'Jenis', 'Referensi', 'Masuk', 'Keluar', 'Saldo', 'Admin']],
      body: tableRows,
      startY: 28
    });

    doc.save(`KartuStok_${currentProd?.sku}_${selectedWarehouse}.pdf`);
  };

  // Export to Excel
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(ledgerData.map(row => ({
      Tanggal: row.date,
      Jenis: row.type,
      Referensi: row.ref,
      Masuk: row.qtyIn,
      Keluar: row.qtyOut,
      Saldo: row.balance,
      Admin: row.actor,
      Catatan: row.notes
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'KartuStok');
    XLSX.writeFile(workbook, `KartuStok_${currentProd?.sku}_${selectedWarehouse}.xlsx`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={24} color="var(--primary)" />
            Kartu Stok (Stock Ledger)
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Histori rinci pergerakan keluar-masuk barang & kalkulasi saldo stok akhir
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExportPDF} className="btn btn-secondary btn-sm">
            <Download size={16} />
            <span>Export PDF</span>
          </button>

          <button onClick={handleExportExcel} className="btn btn-success btn-sm">
            <Download size={16} />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="glass-panel p-4" style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1.5fr auto', gap: '16px', alignItems: 'center' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Pilih Cabang Gudang *</label>
          <select
            className="form-select"
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
          >
            {warehouses.map(w => (
              <option key={w.id} value={w.id}>📍 Gudang {w.city} ({w.name})</option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Pilih Produk SKU *</label>
          <select
            className="form-select"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.sku} — {p.name}</option>
            ))}
          </select>
        </div>

        <div 
          style={{
            padding: '12px 20px',
            backgroundColor: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            textAlign: 'right'
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stok Saat Ini</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
            {currentActualStock} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>{currentProd?.unit}</span>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="table-container glass-panel">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Jenis Transaksi</th>
              <th>No. Referensi</th>
              <th>Qty Masuk (+)</th>
              <th>Qty Keluar (-)</th>
              <th>Saldo Stok</th>
              <th>Admin / Actor</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {ledgerData.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                  Belum ada transaksi recorded untuk produk ini di gudang dipilih.
                </td>
              </tr>
            ) : (
              ledgerData.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ fontSize: '0.85rem' }}>{row.date}</td>
                  <td>
                    {row.type === 'INBOUND' && <Badge variant="success">INBOUND</Badge>}
                    {row.type === 'OUTBOUND' && <Badge variant="danger">OUTBOUND</Badge>}
                    {row.type === 'TRANSFER_IN' && <Badge variant="info">TRANSFER IN</Badge>}
                    {row.type === 'TRANSFER_OUT' && <Badge variant="warning">TRANSFER OUT</Badge>}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{row.ref}</td>
                  <td style={{ fontWeight: 700, color: 'var(--success)' }}>
                    {row.qtyIn > 0 ? `+${row.qtyIn}` : '-'}
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--danger)' }}>
                    {row.qtyOut > 0 ? `-${row.qtyOut}` : '-'}
                  </td>
                  <td style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                    {row.balance}
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{row.actor}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{row.notes}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
