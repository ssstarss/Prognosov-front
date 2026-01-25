import { Credetials } from '../interfaces/interfaces';
import { appState, SERVER } from '../constants';
export default async function loginPassword(user: Credetials) {
  const myHeaders = {
    Accept: 'application/json',
    'Content-type': 'application/json',
    Authorization: 'Basic' + user.password,
  };
  const body = JSON.stringify({ email: user.email, password: user.password });
  const request = {
    method: 'POST',
    headers: myHeaders,
    body,
  };
  try {
    const response = await fetch(`${SERVER}/auth/password`, request);
    if (response.status === 401)
      throw Error(`Ошибка чтения юзеров ${response.status} ${response.statusText} `);
    if (response.ok) {
      const res = await response.json();
      localStorage.setItem('refreshToken', res.refreshToken);
      appState.accessToken = res.accessToken;
      appState.userID = res.userID;
      const headerLinks = Array.from(document.getElementsByClassName('adminHeaderLink'));
      if (res.userRole === 'admin')
        headerLinks.forEach((link) => ((link as HTMLElement).style.display = 'block'));
      else headerLinks.forEach((link) => ((link as HTMLElement).style.display = 'none'));

      console.log('logged user ID:', appState.userID);

      return true;
    } else return false;
  } catch (e: any) {
    console.log(e.message);
    return false;
  }
}
