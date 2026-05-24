import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { appState } from '../../constants';
import { ensureSession } from '../../functions/ensureSession';

type AuthGate = 'pending' | 'authenticated' | 'anonymous';

function resolveGate(accessToken: string): AuthGate {
  return accessToken ? 'authenticated' : 'anonymous';
}

export default function RequireAuth() {
  const [gate, setGate] = useState<AuthGate>(() =>
    appState.accessToken ? 'authenticated' : 'pending'
  );

  useEffect(() => {
    if (appState.accessToken) return;

    let cancelled = false;

    ensureSession()
      .then((ok) => {
        if (!cancelled) setGate(ok ? 'authenticated' : 'anonymous');
      })
      .catch(() => {
        if (!cancelled) setGate('anonymous');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onAuthRefreshed = () => {
      setGate(resolveGate(appState.accessToken));
    };

    window.addEventListener('auth-refreshed', onAuthRefreshed);
    return () => window.removeEventListener('auth-refreshed', onAuthRefreshed);
  }, []);

  if (gate === 'pending') return null;
  if (gate === 'anonymous') return <Navigate to="/login" replace />;
  return <Outlet />;
}
