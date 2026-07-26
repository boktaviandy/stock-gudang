import { create } from 'zustand';
import {
  INITIAL_WAREHOUSES,
  INITIAL_PRODUCTS,
  INITIAL_STOCKS,
  INITIAL_TRANSFERS,
  INITIAL_INBOUNDS,
  INITIAL_OUTBOUNDS,
  INITIAL_OPNAMES,
  INITIAL_USERS
} from '../data/mockData';

export const useInventoryStore = create((set, get) => ({
  warehouses: INITIAL_WAREHOUSES,
  products: INITIAL_PRODUCTS,
  stocks: INITIAL_STOCKS,
  transfers: INITIAL_TRANSFERS,
  inbounds: INITIAL_INBOUNDS,
  outbounds: INITIAL_OUTBOUNDS,
  opnames: INITIAL_OPNAMES,
  users: INITIAL_USERS,
  selectedWarehouseFilter: 'ALL', // 'ALL' or 'JKT', 'DPS', etc.

  setSelectedWarehouseFilter: (whId) => set({ selectedWarehouseFilter: whId }),

  // 1. BARANG MASUK (INBOUND)
  addInbound: ({ warehouseId, date, refNo, supplier, items, createdBy, notes }) => {
    const { stocks, inbounds } = get();
    const newStocks = { ...stocks };

    items.forEach(item => {
      const prodStocks = newStocks[item.productId] ? { ...newStocks[item.productId] } : {};
      const currentQty = prodStocks[warehouseId] || 0;
      prodStocks[warehouseId] = currentQty + Number(item.qty);
      newStocks[item.productId] = prodStocks;
    });

    const newInbound = {
      id: `INB-${Date.now().toString().slice(-6)}`,
      date,
      refNo: refNo || `SJ-${Date.now().toString().slice(-6)}`,
      supplier: supplier || 'Supplier General',
      warehouseId,
      items,
      createdBy,
      notes: notes || ''
    };

    set({
      stocks: newStocks,
      inbounds: [newInbound, ...inbounds]
    });
  },

  // 2. BARANG KELUAR (OUTBOUND)
  addOutbound: ({ warehouseId, date, refNo, customer, items, reason, createdBy, notes }) => {
    const { stocks, outbounds } = get();
    const newStocks = { ...stocks };

    // Check stock availability first
    let hasStockError = false;
    let errorMessage = '';

    items.forEach(item => {
      const currentQty = (newStocks[item.productId] && newStocks[item.productId][warehouseId]) || 0;
      if (item.qty > currentQty) {
        hasStockError = true;
        errorMessage = `Stok ${item.name} tidak mencukupi (Tersedia: ${currentQty}, Diminta: ${item.qty})`;
      }
    });

    if (hasStockError) {
      return { success: false, error: errorMessage };
    }

    // Deduct stock
    items.forEach(item => {
      const prodStocks = { ...newStocks[item.productId] };
      prodStocks[warehouseId] = (prodStocks[warehouseId] || 0) - Number(item.qty);
      newStocks[item.productId] = prodStocks;
    });

    const newOutbound = {
      id: `OUT-${Date.now().toString().slice(-6)}`,
      date,
      refNo: refNo || `DO-${Date.now().toString().slice(-6)}`,
      customer: customer || 'Pelanggan General',
      warehouseId,
      items,
      reason: reason || 'Penjualan',
      createdBy,
      notes: notes || ''
    };

    set({
      stocks: newStocks,
      outbounds: [newOutbound, ...outbounds]
    });

    return { success: true };
  },

  // 3. MUTASI / TRANSFER ANTAR GUDANG
  createTransfer: ({ fromWarehouse, toWarehouse, date, items, createdBy, notes }) => {
    const { transfers, stocks } = get();

    // Deduct from source warehouse stock immediately as In Transit
    const newStocks = { ...stocks };
    items.forEach(item => {
      const prodStocks = { ...newStocks[item.productId] };
      prodStocks[fromWarehouse] = Math.max(0, (prodStocks[fromWarehouse] || 0) - Number(item.qty));
      newStocks[item.productId] = prodStocks;
    });

    const newTransfer = {
      id: `TRF-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      date,
      fromWarehouse,
      toWarehouse,
      items,
      status: 'In Transit',
      createdBy,
      receivedBy: null,
      notes: notes || ''
    };

    set({
      stocks: newStocks,
      transfers: [newTransfer, ...transfers]
    });

    return newTransfer;
  },

  confirmTransferReceipt: (transferId, receivedQtyMap, notes, adminName) => {
    const { transfers, stocks } = get();
    const targetTransfer = transfers.find(t => t.id === transferId);

    if (!targetTransfer) return { success: false, error: 'Transfer tidak ditemukan' };

    const newStocks = { ...stocks };
    const destWarehouse = targetTransfer.toWarehouse;

    // Add received stock to destination warehouse
    targetTransfer.items.forEach(item => {
      const actualQty = receivedQtyMap && receivedQtyMap[item.productId] !== undefined 
        ? Number(receivedQtyMap[item.productId]) 
        : Number(item.qty);

      const prodStocks = { ...newStocks[item.productId] };
      prodStocks[destWarehouse] = (prodStocks[destWarehouse] || 0) + actualQty;
      newStocks[item.productId] = prodStocks;
    });

    const updatedTransfers = transfers.map(t => {
      if (t.id === transferId) {
        return {
          ...t,
          status: 'Received',
          receivedBy: adminName,
          notes: notes ? `${t.notes} | Note Penerimaan: ${notes}` : t.notes
        };
      }
      return t;
    });

    set({
      stocks: newStocks,
      transfers: updatedTransfers
    });

    return { success: true };
  },

  // 4. STOCK OPNAME & ADJUSTMENT
  addOpname: ({ warehouseId, productId, systemQty, actualQty, variance, reason, createdBy, notes, date }) => {
    const { stocks, opnames } = get();

    // Update stock to actualQty directly
    const newStocks = { ...stocks };
    const prodStocks = { ...newStocks[productId] };
    prodStocks[warehouseId] = Number(actualQty);
    newStocks[productId] = prodStocks;

    const newOpname = {
      id: `OPN-${Date.now().toString().slice(-6)}`,
      date: date || new Date().toISOString().split('T')[0],
      warehouseId,
      productId,
      systemQty: Number(systemQty),
      actualQty: Number(actualQty),
      variance: Number(variance),
      reason,
      createdBy,
      notes: notes || ''
    };

    set({
      stocks: newStocks,
      opnames: [newOpname, ...opnames]
    });
  },

  // MASTER DATA ACTIONS
  addProduct: (productData) => {
    const { products, stocks } = get();
    const newProd = {
      ...productData,
      id: `PROD-${Date.now().toString().slice(-5)}`,
      status: 'Active'
    };
    // Initialize stocks
    const newStocks = { ...stocks, [newProd.id]: { JKT: 0, DPS: 0, LOP: 0, UPG: 0, SRG: 0, JOG: 0 } };

    set({
      products: [newProd, ...products],
      stocks: newStocks
    });
  },

  updateProduct: (productData) => {
    const { products } = get();
    set({
      products: products.map(p => p.id === productData.id ? { ...p, ...productData } : p)
    });
  },

  addUser: (userData) => {
    const { users } = get();
    const newUser = {
      ...userData,
      id: `USR-${Date.now().toString().slice(-5)}`,
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    };
    set({ users: [newUser, ...users] });
  },

  updateUser: (userData) => {
    const { users } = get();
    set({
      users: users.map(u => u.id === userData.id ? { ...u, ...userData } : u)
    });
  }
}));
