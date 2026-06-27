import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { appState } from '../../constants';

function isAdminRole(role: string): boolean {
  return role === 'admin' || role === 'superadmin';
}

export default function RequireAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => isAdminRole(appState.userRole));

  useEffect(() => {
    const onAuthRefreshed = () => {
      setIsAdmin(isAdminRole(appState.userRole));
    };
    window.addEventListener('auth-refreshed', onAuthRefreshed);
    return () => window.removeEventListener('auth-refreshed', onAuthRefreshed);
  }, []);

  if (!isAdmin) return <Navigate to="/mainTable" replace />;
  return <Outlet />;
}
