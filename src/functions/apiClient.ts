import { appState } from '../constants';
import { clearAuthSession, redirectToLogin, refreshAccessToken } from './refreshAccessToken';

function resolveUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

function isAuthRequest(url: string): boolean {
  return url.includes('/auth/');
}

function withAccessToken(init?: RequestInit): RequestInit {
  const headers = new Headers(init?.headers);
  if (appState.accessToken) {
    headers.set('Authorization', 'Bearer ' + appState.accessToken);
  }
  return { ...init, headers };
}

/**
 * fetch с Bearer accessToken; при 401 — один refresh и повтор запроса.
 * Auth-эндпоинты (/auth/*) не ретраятся.
 */
export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = resolveUrl(input);
  let response = await fetch(input, withAccessToken(init));

  if (response.status !== 401 || isAuthRequest(url)) {
    return response;
  }

  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    clearAuthSession();
    redirectToLogin();
    return response;
  }

  return fetch(input, withAccessToken(init));
}
