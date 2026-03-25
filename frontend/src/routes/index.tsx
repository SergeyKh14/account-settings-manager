import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { AccountsPage } from '../pages/AccountsPage';
import { AccountSettingsPage } from '../pages/AccountSettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <AccountsPage /> },
      { path: 'accounts/:id/settings', element: <AccountSettingsPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
