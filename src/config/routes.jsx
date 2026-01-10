import React from 'react';
import { Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from '../components/layout/DashboardLayout/DashboardLayout';

// Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Overview from '../pages/dashboard/Overview';
import Analytics from '../pages/dashboard/Analytics';
import Reports from '../pages/dashboard/Reports';
import LeadsList from '../pages/leads/LeadsList';
import LeadDetails from '../pages/leads/LeadDetails';
import ImportLeads from '../pages/leads/ImportLeads';
import ContactsList from '../pages/contacts/ContactsList';
import ContactDetails from '../pages/contacts/ContactDetails';
import SalesPipeline from '../pages/pipeline/SalesPipeline';
import PipelineAnalytics from '../pages/pipeline/PipelineAnalytics';
import UserManagement from '../pages/settings/UserManagement';
import CompanySettings from '../pages/settings/CompanySettings';
import NotFound from '../pages/404';

// Private Route wrapper
const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? children : <Navigate to="/login" />;
};

// Public Route wrapper (redirect if logged in)
const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? <Navigate to="/dashboard" /> : children;
};

const routes = [
  {
    path: '/',
    element: <Navigate to="/dashboard" />,
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <PublicRoute>
        <ForgotPassword />
      </PublicRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Overview />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
    ],
  },
  {
    path: '/leads',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <LeadsList />,
      },
      {
        path: ':id',
        element: <LeadDetails />,
      },
      {
        path: 'import',
        element: <ImportLeads />,
      },
    ],
  },
  {
    path: '/contacts',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <ContactsList />,
      },
      {
        path: ':id',
        element: <ContactDetails />,
      },
    ],
  },
  {
    path: '/pipeline',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <SalesPipeline />,
      },
      {
        path: 'analytics',
        element: <PipelineAnalytics />,
      },
    ],
  },
  {
    path: '/settings',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <UserManagement />,
      },
      {
        path: 'company',
        element: <CompanySettings />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;