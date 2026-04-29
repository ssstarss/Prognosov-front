import { appState, SERVER } from '../constants';
import initStartValues from './initStartValues';
import { readErrorMessage } from './errorMessage';

export default async function loginRefresh() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) {
    const myHeaders = {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + refreshToken,
    };
    const request = {
      method: 'POST',
      headers: myHeaders,
    };
    try {
      const response = await fetch(`${SERVER}/auth/refresh`, request);
      
      if (!response.ok) {
        const message = await readErrorMessage(response, 'Ошибка обновления сессии');
        throw Error(message);
      }
      const res = await response.json();
      appState.accessToken = res.accessToken;
      appState.userID = res.userID;
      appState.userRole = typeof res.userRole === 'string' ? res.userRole : 'user';
      await initStartValues();
      window.dispatchEvent(new Event('auth-refreshed'));

      const header = document.getElementById('header');
      if (header) header.style.display = 'flex';

      const isAdmin = appState.userRole === 'admin' || appState.userRole === 'superadmin';
      const headerLinks = Array.from(document.getElementsByClassName('adminHeaderLink'));
      headerLinks.forEach((link) => ((link as HTMLElement).style.display = isAdmin ? 'block' : 'none'));
    } catch (e: any) {
      console.log(e?.message || 'loginpage error refresh');
      return false;
    }
    return true;
  }
  return false;
}
