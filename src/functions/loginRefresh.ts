import { appState } from '../constants';
import initStartValues from './initStartValues';
import { refreshAccessToken } from './refreshAccessToken';
import { markSessionAnonymous, markSessionAuthenticated } from './ensureSession';

/** Полный refresh при старте приложения / профиле: токены + initStartValues + шапка. */
export default async function loginRefresh() {
  const ok = await refreshAccessToken();
  if (!ok) {
    markSessionAnonymous();
    return false;
  }

  await initStartValues();

  const header = document.getElementById('header');
  if (header) header.style.display = 'flex';

  const isAdmin = appState.userRole === 'admin' || appState.userRole === 'superadmin';
  const headerLinks = Array.from(document.getElementsByClassName('adminHeaderLink'));
  headerLinks.forEach((link) => ((link as HTMLElement).style.display = isAdmin ? 'block' : 'none'));

  markSessionAuthenticated();
  return true;
}
