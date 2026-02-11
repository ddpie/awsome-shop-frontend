import { createBrowserRouter } from 'react-router';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import EmployeeLayout from '../components/Layout/EmployeeLayout';
import AdminLayout from '../components/Layout/AdminLayout';
import ShopHome from '../pages/ShopHome';
import Dashboard from '../pages/Dashboard';
import ProductList from '../pages/Products';
import CreateProduct from '../pages/Products/CreateProduct';
import CategoryList from '../pages/Categories';
import PointRuleList from '../pages/PointRules';
import AuthGuard from './AuthGuard';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
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
      { index: true, element: <ShopHome /> },
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
      { index: true, element: <Dashboard /> },
      { path: 'products', element: <ProductList /> },
      { path: 'products/create', element: <CreateProduct /> },
      { path: 'categories', element: <CategoryList /> },
      { path: 'points', element: <PointRuleList /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
