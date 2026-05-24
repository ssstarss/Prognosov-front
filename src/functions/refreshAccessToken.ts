import { appState, SERVER } from '../constants';
import { readErrorMessage } from './errorMessage';

/** Один refresh на все параллельные 401 — иначе бэкенд инвалидирует лишние refresh-токены. */
let refreshInFlight: Promise<boolean> | null = null;

export function clearAuthSession() {
  localStorage.removeItem('refreshToken');
  appState.accessToken = '';
  appState.userID = 0;
  appState.userRole = 'user';
}

export function redirectToLogin() {
  window.location.replace(`${window.location.origin}/#/login`);
}

/**
 * Обновляет access (и refresh) по refreshToken из localStorage.
 * @returns true — токены обновлены, false — сессия недействительна
 */
export async function refreshAccessToken(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = performRefresh().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

async function performRefresh(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${SERVER}/auth/refresh`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + refreshToken,
      },
    });

    if (!response.ok) {
      const message = await readErrorMessage(response, 'Ошибка обновления сессии');
      console.warn(message);
      clearAuthSession();
      return false;
    }

    const res = await response.json();
    appState.accessToken = res.accessToken;
    appState.userID = res.userID;
    appState.userRole = typeof res.userRole === 'string' ? res.userRole : 'user';

    if (res.refreshToken) {
      localStorage.setItem('refreshToken', res.refreshToken);
    }

    window.dispatchEvent(new Event('auth-refreshed'));
    return true;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'loginRefresh error';
    console.warn(message);
    clearAuthSession();
    return false;
  }
}
