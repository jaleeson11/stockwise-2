import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load components for better performance
const Dashboard = lazy(() => import('../features/dashboard/Dashboard'));
const ProductList = lazy(() => import('../features/products/ProductList'));
const ProductDetail = lazy(() => import('../features/products/ProductDetail'));
const VariantList = lazy(() => import('../features/variants/VariantList'));
const CategoryList = lazy(() => import('../features/categories/CategoryList'));
const Integrations = lazy(() => import('../features/integrations/Integrations'));
const Orders = lazy(() => import('../features/orders/Orders'));
const Reports = lazy(() => import('../features/reports/Reports'));
const Settings = lazy(() => import('../features/settings/Settings'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/inventory',
    children: [
      {
        index: true,
        element: <ProductList />,
      },
      {
        path: ':productId',
        element: <ProductDetail />,
      },
    ],
  },
  {
    path: '/products',
    children: [
      {
        index: true,
        element: <ProductList />,
      },
      {
        path: ':productId',
        element: <ProductDetail />,
      },
    ],
  },
  {
    path: '/variants',
    element: <VariantList />,
  },
  {
    path: '/categories',
    element: <CategoryList />,
  },
  {
    path: '/integrations',
    children: [
      {
        index: true,
        element: <Integrations />,
      },
      {
        path: 'connect/:platformId',
        element: <Integrations />, // This will be replaced with actual component
      },
      {
        path: 'settings/:platformId',
        element: <Integrations />, // This will be replaced with actual component
      },
    ],
  },
  {
    path: '/orders',
    element: <Orders />,
  },
  {
    path: '/reports',
    children: [
      {
        index: true,
        element: <Reports />,
      },
      {
        path: ':reportId',
        element: <Reports />, // This will be replaced with actual component
      },
    ],
  },
  {
    path: '/settings',
    children: [
      {
        index: true,
        element: <Settings />,
      },
      {
        path: 'users',
        element: <Settings />, // This will be replaced with actual component
      },
      {
        path: 'notifications',
        element: <Settings />, // This will be replaced with actual component
      },
    ],
  },
]; 