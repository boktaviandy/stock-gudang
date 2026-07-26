import React, { useState } from 'react';
import { History, Download, Filter, Building2 } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useInventoryStore } from '../store/inventoryStore';
import { Badge } from '../components/ui/Badge';

export const MutationReportPage = () => {
  const { warehouses, products, stocks, inbounds, outbounds, transfers } = useInventoryStore();

  const [selectedWarehouse, setSelectedWarehouse] = useState('ALL');

  // Compute monthly mutation recap per SKU
  const mutationSummaryList = products.map(p => {
    let inboundQty = 0;
    let outboundQty = 0;
    let transferInQty = 0;
    let transferOutQty = 0;

    // Filter inbounds
    inbounds.forEach(inb => {
      if (selectedWarehouse === 'ALL' || inb.warehouseId === selectedWarehouse) {
        inb.items.forEach(item => {
          if (item.productId === p.id) inboundQty += Number(item.qty);
        });
      }
    });

    // Filter outbounds
    outbounds.forEach(outb => {
      if (selectedWarehouse === 'ALL' || outb.warehouseId === selectedWarehouse) {
        outb.items.forEach(item => {
          if (item.productId === p.id) outboundQty += Number(item.qty);
        });
      }
    });

    // Filter transfers
    transfers.forEach(trf => {
      if (trf.status === 'Received') {
        if (selectedWarehouse === 'ALL' || trf.toWarehouse === selectedWarehouse) {
          trf.items.forEach(item => {
            if (item.productId === p.id) transferInQty += Number(item.qty);
          });
        }
      }
      if (selectedWarehouse === 'ALL' || trf.fromWarehouse === selectedWarehouse) {
        trf.items.forEach(item => {
          if (item.productId === p.id) transferOutQty += Number(item.qty);
        });
      }
    });

    // Current stock calculation
    let currentTotal = 0;
    if (selectedWarehouse !== 'ALL') {
      currentTotal = (stocks[p.id] && stocks[p.id][selectedWarehouse]) || 0;
    } else {
      warehouses.forEach(w => {
        currentTotal += (stocks[p.id] && stocks[p.id][w.id]) || 0;
      });
    }

    const initialStock = Math.max(0, currentTotal - inboundQty - transferInQty + outboundQty + transferOutQty);

    return {
      productId: p.id,
      sku: p.sku,
      name: p.name,
      unit: p.unit,
      initialStock,
      inboundQty,
      outboundQty,
      transferInQty,
      transferOutQty,
      currentTotal
    };
  });

  const handleExportExcel = () => {
    const data = mutationSummaryList.map(item => ({
      SKU: item.sku,
      NamaProduk: item.name,
      Satuan: item.unit,
      StokAwal: item.initialStock,
      BarangMasuk: item.inboundQty,
      BarangKeluar: item.outboundQty,
      TransferIn: item.transferInQty,
      TransferOut: item.transferOutQty,
      StokAkhir: item.currentTotal
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'LaporanMutasi');
    XLSX.writeFile(workbook, `LaporanMutasiStok_${selectedWarehouse}.xlsx`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History size={24} color="var(--primary)" />
            Laporan Rekapitulasi Mutasi Stok
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Rekap bulanan alur mutasi barang masuk, keluar, dan transfer per SKU
          </p>
        </div>

        <button onClick={handleExportExcel} className="btn btn-success">
          <Download size={18} />
          <span>Export Excel</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="glass-panel p-4" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>Scope Gudang:</span>
        <select
          className="form-select"
          style={{ width: '220px' }}
          value={selectedWarehouse}
          onChange={(e) => setSelectedWarehouse(e.target.value)}
        >
          <option value="ALL">🌐 Semua Gudang (Nasional)</option>
          {warehouses.map(w => (
            <option key={w.id} value={w.id}>📍 Gudang {w.city} ({w.id})</option>
          ))}
        </select>
      </div>

      {/* Mutation Table */}
      <div className="table-container glass-panel">
        <table className="custom-table">
          <thead>
            <tr>
              <th>SKU & Produk</th>
              <th style={{ textAlign: 'center' }}>Stok Awal</th>
              <th style={{ textAlign: 'center', color: 'var(--success)' }}>Masuk (+)</th>
              <th style={{ textAlign: 'center', color: 'var(--danger)' }}>Keluar (-)</th>
              <th style={{ textAlign: 'center', color: 'var(--info)' }}>Transfer In (+)</th>
              <th style={{ textAlign: 'center', color: 'var(--warning)' }}>Transfer Out (-)</th>
              <th style={{ textAlign: 'center' }}>Stok Akhir</th>
            </tr>
          </thead>
          <tbody>
            {mutationSummaryList.map(item => (
              <tr key={item.productId}>
                <td>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.sku}</div>
                </td>
                <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {item.initialStock} {item.unit}
                </td>
                <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--success)' }}>
                  {item.inboundQty > 0 ? `+${item.inboundQty}` : '-'}
                </td>
                <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--danger)' }}>
                  {item.outboundQty > 0 ? `-${item.outboundQty}` : '-'}
                </td>
                <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--info)' }}>
                  {item.transferInQty > 0 ? `+${item.transferInQty}` : '-'}
                </td>
                <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--warning)' }}>
                  {item.transferOutQty > 0 ? `-${item.transferOutQty}` : '-'}
                </td>
                <td style={{ textAlign: 'center', fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  {item.currentTotal} {item.unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
