import { appState } from '../constants';
import loginRefresh from './loginRefresh';

let sessionPromise: Promise<boolean> | null = null;

export function markSessionAuthenticated(): void {
  sessionPromise = Promise.resolve(true);
}

export function markSessionAnonymous(): void {
  sessionPromise = Promise.resolve(false);
}

/** Сброс после logout — следующий ensureSession вызовет loginRefresh заново. */
export function resetSessionBootstrap(): void {
  sessionPromise = null;
}

/** Один loginRefresh на загрузку; после логина кэш обновляется через markSession*. */
export function ensureSession(): Promise<boolean> {
  if (appState.accessToken) {
    markSessionAuthenticated();
    return sessionPromise!;
  }
  if (!sessionPromise) {
    sessionPromise = loginRefresh();
  }
  return sessionPromise;
}
