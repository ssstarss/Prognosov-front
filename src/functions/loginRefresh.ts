import { appState, SERVER } from '../constants';
import initStartValues from './initStartValues';

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
      
      if (!response.ok) throw Error(response.statusText);
      const res = await response.json();
      appState.accessToken = res.accessToken;
      appState.userID = res.userID;
      appState.userRole = typeof res.userRole === 'string' ? res.userRole : 'user';
      await initStartValues();

      if (appState.userRole === 'admin' || appState.userRole === 'superadmin') {
        const headerLinks = Array.from(document.getElementsByClassName('adminHeaderLink'));
        headerLinks.forEach((link) => ((link as HTMLElement).style.display = 'block'));
      }
    } catch (e: any) {
      console.log('loginpage error refresh');
      return false;
    }
    return true;
  }
  return false;
}
