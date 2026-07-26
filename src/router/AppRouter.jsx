import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { useAuthStore } from '../store/authStore';
import { AppShell } from '../components/layout/AppShell';

import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { StockOverviewPage } from '../pages/StockOverviewPage';
import { InboundPage } from '../pages/InboundPage';
import { OutboundPage } from '../pages/OutboundPage';
import { StockOpnamePage } from '../pages/StockOpnamePage';
import { TransferListPage } from '../pages/TransferListPage';
import { TransferCreatePage } from '../pages/TransferCreatePage';
import { PendingReceivingPage } from '../pages/PendingReceivingPage';
import { StockLedgerPage } from '../pages/StockLedgerPage';
import { MutationReportPage } from '../pages/MutationReportPage';
import { ProductMasterPage } from '../pages/ProductMasterPage';
import { WarehouseMasterPage } from '../pages/WarehouseMasterPage';
import { UserManagementPage } from '../pages/UserManagementPage';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Super Admin Only Guard
const SuperAdminRoute = ({ children }) => {
  const { isSuperAdmin } = useAuthStore();
  if (!isSuperAdmin()) {
    return <Navigate to="/app/dashboard" replace />;
  }
  return children;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected App Layout Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Inventory Routes */}
          <Route path="inventory/stock" element={<StockOverviewPage />} />
          <Route path="inventory/inbound" element={<InboundPage />} />
          <Route path="inventory/outbound" element={<OutboundPage />} />
          <Route path="inventory/opname" element={<StockOpnamePage />} />

          {/* Transfer Routes */}
          <Route path="transfer/list" element={<TransferListPage />} />
          <Route path="transfer/create" element={<TransferCreatePage />} />
          <Route path="transfer/pending" element={<PendingReceivingPage />} />

          {/* Reports Routes */}
          <Route path="reports/stock-ledger" element={<StockLedgerPage />} />
          <Route path="reports/mutation" element={<MutationReportPage />} />

          {/* Product Catalog & Categories (All Roles) */}
          <Route path="master/products" element={<ProductMasterPage />} />

          {/* Master Data Routes (Super Admin Only) */}
          <Route
            path="master/warehouses"
            element={
              <SuperAdminRoute>
                <WarehouseMasterPage />
              </SuperAdminRoute>
            }
          />
          <Route
            path="master/users"
            element={
              <SuperAdminRoute>
                <UserManagementPage />
              </SuperAdminRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
