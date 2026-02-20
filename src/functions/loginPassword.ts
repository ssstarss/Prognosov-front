import { Credetials } from '../interfaces/interfaces';
import { appState, SERVER } from '../constants';
import loginRefresh from './loginRefresh';
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
      await loginRefresh()
      


      return true;
    } else return false;
  } catch (e: any) {
    console.log(e.message);
    return false;
  }
}
