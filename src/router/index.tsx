import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AuthGuard from './AuthGuard';
import EmployeeLayout from '../components/Layout/EmployeeLayout';
import AdminLayout from '../components/Layout/AdminLayout';

// Lazy-loaded pages — auth
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));

// Lazy-loaded pages — employee
const ShopHomePage = lazy(() => import('../pages/employee/ShopHomePage'));
const ProductDetailPage = lazy(() => import('../pages/employee/ProductDetailPage'));
const OrderConfirmPage = lazy(() => import('../pages/employee/OrderConfirmPage'));
const DeliveryInfoPage = lazy(() => import('../pages/employee/DeliveryInfoPage'));
const RedemptionSuccessPage = lazy(() => import('../pages/employee/RedemptionSuccessPage'));
const OrderListPage = lazy(() => import('../pages/employee/OrderListPage'));
const OrderDetailPage = lazy(() => import('../pages/employee/OrderDetailPage'));
const PointsPage = lazy(() => import('../pages/employee/PointsPage'));

// Lazy-loaded pages — admin
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
const ProductManagePage = lazy(() => import('../pages/admin/ProductManagePage'));
const OrderManagePage = lazy(() => import('../pages/admin/OrderManagePage'));
const UserManagePage = lazy(() => import('../pages/admin/UserManagePage'));
const PointsManagePage = lazy(() => import('../pages/admin/PointsManagePage'));
const CategoryManagePage = lazy(() => import('../pages/admin/CategoryManagePage'));
const ProductEditPage = lazy(() => import('../pages/admin/ProductEditPage'));
const AdminProductDetailPage = lazy(() => import('../pages/admin/ProductDetailPage'));
const AdminOrderDetailPage = lazy(() => import('../pages/admin/OrderDetailPage'));
const UserPointsHistoryPage = lazy(() => import('../pages/admin/UserPointsHistoryPage'));

// Lazy-loaded pages — error
const NotFoundPage = lazy(() => import('../pages/error/NotFoundPage'));

const wrap = (element: React.ReactNode) => (
  <Suspense fallback={<LoadingSpinner fullPage />}>{element}</Suspense>
);

const router = createBrowserRouter([
  {
    path: '/login',
    element: wrap(<LoginPage />),
  },
  {
    path: '/register',
    element: wrap(<RegisterPage />),
  },
  // Employee routes
  {
    path: '/',
    element: (
      <AuthGuard requiredRole="employee">
        <EmployeeLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: wrap(<ShopHomePage />) },
      { path: 'products/:id', element: wrap(<ProductDetailPage />) },
      { path: 'orders/confirm/:productId', element: wrap(<OrderConfirmPage />) },
      { path: 'orders/confirm/:productId/delivery', element: wrap(<DeliveryInfoPage />) },
      { path: 'orders/success', element: wrap(<RedemptionSuccessPage />) },
      { path: 'orders', element: wrap(<OrderListPage />) },
      { path: 'orders/:id', element: wrap(<OrderDetailPage />) },
      { path: 'points', element: wrap(<PointsPage />) },
    ],
  },
  // Admin routes
  {
    path: '/admin',
    element: (
      <AuthGuard requiredRole="admin">
        <AdminLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: wrap(<DashboardPage />) },
      { path: 'products', element: wrap(<ProductManagePage />) },
      { path: 'products/new/edit', element: wrap(<ProductEditPage />) },
      { path: 'products/:id', element: wrap(<AdminProductDetailPage />) },
      { path: 'products/:id/edit', element: wrap(<ProductEditPage />) },
      { path: 'orders', element: wrap(<OrderManagePage />) },
      { path: 'orders/:id', element: wrap(<AdminOrderDetailPage />) },
      { path: 'users', element: wrap(<UserManagePage />) },
      { path: 'users/:id/points', element: wrap(<UserPointsHistoryPage />) },
      { path: 'points', element: wrap(<PointsManagePage />) },
      { path: 'categories', element: wrap(<CategoryManagePage />) },
    ],
  },
  {
    path: '/404',
    element: wrap(<NotFoundPage />),
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
]);

export default router;
