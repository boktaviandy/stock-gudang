// Mock Data for Multi-Warehouse Inventory System (6 Gudang)

export const INITIAL_WAREHOUSES = [
  {
    id: 'JKT',
    name: 'Gudang Utama Jakarta',
    city: 'Jakarta',
    address: 'Jl. Raya Industri No. 45, Sunter, Jakarta Utara 14430',
    pic: 'Reza Mahendra',
    phone: '0812-3456-7890',
    capacity: 15000,
    color: '#4F6EF7'
  },
  {
    id: 'DPS',
    name: 'Gudang Cabang Bali',
    city: 'Denpasar',
    address: 'Jl. Bypass Ngurah Rai No. 88, Sanur, Denpasar, Bali 80228',
    pic: 'Sari Dewi',
    phone: '0813-9876-5432',
    capacity: 10000,
    color: '#F59E0B'
  },
  {
    id: 'LOP',
    name: 'Gudang Cabang Lombok',
    city: 'Mataram',
    address: 'Jl. Tuan Guru Lopan No. 12, Ampenan, Mataram, NTB 83111',
    pic: 'Hendra Putra',
    phone: '0822-1111-2222',
    capacity: 8000,
    color: '#EF4444'
  },
  {
    id: 'UPG',
    name: 'Gudang Cabang Sulawesi',
    city: 'Makassar',
    address: 'Jl. Kawasan Industri Makassar (KIMA) Blok 5, Makassar 90241',
    pic: 'Ahmad Fauzi',
    phone: '0852-4444-5555',
    capacity: 12000,
    color: '#22C55E'
  },
  {
    id: 'SRG',
    name: 'Gudang Cabang Jawa Tengah',
    city: 'Semarang',
    address: 'Jl. Gatot Subroto Candi No. 20, Semarang, Jateng 50181',
    pic: 'Budi Santoso',
    phone: '0811-7777-8888',
    capacity: 14000,
    color: '#3B82F6'
  },
  {
    id: 'JOG',
    name: 'Gudang Cabang Jogja',
    city: 'Sleman',
    address: 'Jl. Magelang Km 9.5, Sleman, DI Yogyakarta 55581',
    pic: 'Lestari Wati',
    phone: '0878-3333-4444',
    capacity: 9000,
    color: '#8B5CF6'
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'PROD-001',
    sku: 'SKU-KBL-001',
    name: 'Kabel HDMI 2.1 High Speed 2m',
    category: 'Kabel & Konektor',
    unit: 'Pcs',
    minStock: 20,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&auto=format&fit=crop&q=80',
    description: 'Kabel HDMI Ultra High Speed 4K 120Hz 48Gbps nylon braided.'
  },
  {
    id: 'PROD-002',
    sku: 'SKU-AKS-047',
    name: 'Adapter USB-C Multiport 7-in-1 Hub',
    category: 'Aksesoris',
    unit: 'Pcs',
    minStock: 15,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=150&auto=format&fit=crop&q=80',
    description: 'Aluminium Type-C Hub dengan HDMI 4K, 3x USB 3.0, SD Reader, 100W PD.'
  },
  {
    id: 'PROD-003',
    sku: 'SKU-ELK-112',
    name: 'Mouse Wireless Silent Click M235',
    category: 'Elektronik & Perangkat',
    unit: 'Pcs',
    minStock: 25,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=150&auto=format&fit=crop&q=80',
    description: 'Mouse Wireless 2.4GHz ergonomis dengan baterai tahan 12 bulan.'
  },
  {
    id: 'PROD-004',
    sku: 'SKU-NET-089',
    name: 'Router Wi-Fi 6 Dual Band AX3000',
    category: 'Networking',
    unit: 'Unit',
    minStock: 10,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=150&auto=format&fit=crop&q=80',
    description: 'Gigabit Wireless Router WiFi 6 kecepatan hingga 3000Mbps dengan OFDMA.'
  },
  {
    id: 'PROD-005',
    sku: 'SKU-ELK-205',
    name: 'Keyboard Mechanical RGB TKL Wireless',
    category: 'Elektronik & Perangkat',
    unit: 'Pcs',
    minStock: 12,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=150&auto=format&fit=crop&q=80',
    description: 'Mechanical keyboard hot-swappable Bluetooth & 2.4Ghz.'
  },
  {
    id: 'PROD-006',
    sku: 'SKU-NET-120',
    name: 'Switch Unmanaged 24-Port Gigabit',
    category: 'Networking',
    unit: 'Unit',
    minStock: 8,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=150&auto=format&fit=crop&q=80',
    description: 'Rackmount 24-Port 10/100/1000Mbps metal casing.'
  },
  {
    id: 'PROD-007',
    sku: 'SKU-KBL-032',
    name: 'Kabel UTP Cat6 Outdoor Roll 305m',
    category: 'Kabel & Konektor',
    unit: 'Roll',
    minStock: 5,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?w=150&auto=format&fit=crop&q=80',
    description: 'Kabel LAN Outdoor double jacket 100% Copper.'
  },
  {
    id: 'PROD-008',
    sku: 'SKU-AKS-190',
    name: 'Webcam Full HD 1080p Auto Focus',
    category: 'Aksesoris',
    unit: 'Pcs',
    minStock: 15,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=150&auto=format&fit=crop&q=80',
    description: 'Webcam USB dengan Dual Microphone & Privacy Cover.'
  }
];

// Initial stock mapping per warehouse (Product ID -> { WarehouseID: Quantity })
export const INITIAL_STOCKS = {
  'PROD-001': { JKT: 450, DPS: 120, LOP: 3, UPG: 230, SRG: 310, JOG: 85 },   // LOP low stock alert
  'PROD-002': { JKT: 800, DPS: 8, LOP: 150, UPG: 300, SRG: 410, JOG: 190 },   // DPS low stock alert
  'PROD-003': { JKT: 1200, DPS: 340, LOP: 180, UPG: 420, SRG: 600, JOG: 5 },  // JOG low stock alert
  'PROD-004': { JKT: 95, DPS: 30, LOP: 12, UPG: 45, SRG: 50, JOG: 20 },
  'PROD-005': { JKT: 180, DPS: 40, LOP: 15, UPG: 60, SRG: 90, JOG: 35 },
  'PROD-006': { JKT: 40, DPS: 12, LOP: 4, UPG: 18, SRG: 22, JOG: 7 },         // LOP & JOG low stock
  'PROD-007': { JKT: 65, DPS: 18, LOP: 8, UPG: 25, SRG: 30, JOG: 14 },
  'PROD-008': { JKT: 210, DPS: 55, LOP: 22, UPG: 80, SRG: 110, JOG: 45 }
};

export const INITIAL_USERS = [
  {
    id: 'USR-001',
    name: 'Budi Raharjo',
    email: 'superadmin@stockhq.id',
    role: 'Super Admin',
    assignedWarehouse: null,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'USR-002',
    name: 'Reza Mahendra',
    email: 'admin.jkt@stockhq.id',
    role: 'Admin Gudang',
    assignedWarehouse: 'JKT',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'USR-003',
    name: 'Sari Dewi',
    email: 'admin.bali@stockhq.id',
    role: 'Admin Gudang',
    assignedWarehouse: 'DPS',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'USR-004',
    name: 'Hendra Putra',
    email: 'admin.lombok@stockhq.id',
    role: 'Admin Gudang',
    assignedWarehouse: 'LOP',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'USR-005',
    name: 'Ahmad Fauzi',
    email: 'admin.sulawesi@stockhq.id',
    role: 'Admin Gudang',
    assignedWarehouse: 'UPG',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_TRANSFERS = [
  {
    id: 'TRF-2026-046',
    date: '2026-07-26',
    fromWarehouse: 'JKT',
    toWarehouse: 'LOP',
    items: [
      { productId: 'PROD-001', sku: 'SKU-KBL-001', name: 'Kabel HDMI 2.1 High Speed 2m', qty: 50 },
      { productId: 'PROD-003', sku: 'SKU-ELK-112', name: 'Mouse Wireless Silent Click M235', qty: 100 }
    ],
    status: 'In Transit', // Draft, In Transit, Received, Cancelled
    createdBy: 'Reza Mahendra',
    receivedBy: null,
    notes: 'Restok rutin cabang Lombok untuk proyek kementerian NTB'
  },
  {
    id: 'TRF-2026-045',
    date: '2026-07-25',
    fromWarehouse: 'JKT',
    toWarehouse: 'DPS',
    items: [
      { productId: 'PROD-002', sku: 'SKU-AKS-047', name: 'Adapter USB-C Multiport 7-in-1 Hub', qty: 50 }
    ],
    status: 'In Transit',
    createdBy: 'Reza Mahendra',
    receivedBy: null,
    notes: 'Pengiriman darurat mengatasi stok kritis Bali'
  },
  {
    id: 'TRF-2026-044',
    date: '2026-07-24',
    fromWarehouse: 'SRG',
    toWarehouse: 'UPG',
    items: [
      { productId: 'PROD-004', sku: 'SKU-NET-089', name: 'Router Wi-Fi 6 Dual Band AX3000', qty: 15 }
    ],
    status: 'Received',
    createdBy: 'Budi Santoso',
    receivedBy: 'Ahmad Fauzi',
    notes: 'Relokasi stok antar regional'
  },
  {
    id: 'TRF-2026-043',
    date: '2026-07-23',
    fromWarehouse: 'DPS',
    toWarehouse: 'JOG',
    items: [
      { productId: 'PROD-005', sku: 'SKU-ELK-205', name: 'Keyboard Mechanical RGB TKL Wireless', qty: 10 }
    ],
    status: 'Draft',
    createdBy: 'Sari Dewi',
    receivedBy: null,
    notes: 'Pengajuan transfer internal'
  }
];

export const INITIAL_INBOUNDS = [
  {
    id: 'INB-2026-089',
    date: '2026-07-26',
    refNo: 'SJ-2026-SUPP-901',
    supplier: 'PT Supplier Tech Nusantara',
    warehouseId: 'JKT',
    items: [
      { productId: 'PROD-001', sku: 'SKU-KBL-001', name: 'Kabel HDMI 2.1 High Speed 2m', qty: 200 }
    ],
    createdBy: 'Reza Mahendra',
    notes: 'Penerimaan PO #PO-99120'
  },
  {
    id: 'INB-2026-088',
    date: '2026-07-25',
    refNo: 'SJ-2026-SUPP-844',
    supplier: 'CV Kabel Jaya Mandiri',
    warehouseId: 'SRG',
    items: [
      { productId: 'PROD-007', sku: 'SKU-KBL-032', name: 'Kabel UTP Cat6 Outdoor Roll 305m', qty: 15 }
    ],
    createdBy: 'Budi Santoso',
    notes: 'Pasokan proyek regional Semarang'
  }
];

export const INITIAL_OUTBOUNDS = [
  {
    id: 'OUT-2026-112',
    date: '2026-07-26',
    refNo: 'DO-2026-CUST-401',
    customer: 'Toko Elektronik Digital Bali',
    warehouseId: 'DPS',
    items: [
      { productId: 'PROD-003', sku: 'SKU-ELK-112', name: 'Mouse Wireless Silent Click M235', qty: 12 }
    ],
    reason: 'Penjualan / Client Order',
    createdBy: 'Sari Dewi',
    notes: 'Pengiriman nota SO-88401'
  },
  {
    id: 'OUT-2026-111',
    date: '2026-07-25',
    refNo: 'DO-2026-INTERNAL-05',
    customer: 'Operasional Internal HO',
    warehouseId: 'JKT',
    items: [
      { productId: 'PROD-004', sku: 'SKU-NET-089', name: 'Router Wi-Fi 6 Dual Band AX3000', qty: 2 }
    ],
    reason: 'Pemakaian Internal',
    createdBy: 'Reza Mahendra',
    notes: 'Pemasangan Wi-Fi ruang meeting baru'
  }
];

export const INITIAL_OPNAMES = [
  {
    id: 'OPN-2026-012',
    date: '2026-07-25',
    warehouseId: 'DPS',
    productId: 'PROD-001',
    systemQty: 125,
    actualQty: 120,
    variance: -5,
    reason: 'Rusak / Fisik Cacat',
    createdBy: 'Sari Dewi',
    notes: 'Ditemukan 5 unit kemasan penyok & kabel terkelupas'
  },
  {
    id: 'OPN-2026-011',
    date: '2026-07-22',
    warehouseId: 'SRG',
    productId: 'PROD-003',
    systemQty: 598,
    actualQty: 600,
    variance: 2,
    reason: 'Kesalahan Input Sebelumnya',
    createdBy: 'Budi Santoso',
    notes: 'Koreksi kelebihan fisik dari penerimaan lalu'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-001',
    type: 'DANGER', // DANGER, WARNING, SUCCESS, INFO
    title: 'Stok Kritis Lombok!',
    message: 'Kabel HDMI 2.1 (SKU-KBL-001) di Gudang Lombok tersisa 3 pcs (min: 20 pcs).',
    timestamp: '2026-07-26 09:30',
    read: false,
    link: '/app/inventory/stock'
  },
  {
    id: 'NOTIF-002',
    type: 'WARNING',
    title: 'Transfer Menunggu Konfirmasi',
    message: 'Transfer #TRF-2026-046 dari Jakarta ke Lombok (150 pcs) siap diterima.',
    timestamp: '2026-07-26 08:15',
    read: false,
    link: '/app/transfer/pending'
  },
  {
    id: 'NOTIF-003',
    type: 'WARNING',
    title: 'Stok Bali Mendekati Batas',
    message: 'Adapter USB-C Hub (SKU-AKS-047) tersisa 8 pcs (min: 15 pcs).',
    timestamp: '2026-07-25 14:00',
    read: true,
    link: '/app/inventory/stock'
  }
];
