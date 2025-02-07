import Credetials from '../interfaces/interfaces';
import { commonVars } from '../constants';
export default async function loginPassword(user: Credetials) {
  const myHeaders = {
    Accept: 'application/json',
    'Content-type': 'application/json',
    Authorization: 'Basic' + user.password,
  };
  const body = JSON.stringify({ email: user.email });

  const request = {
    method: 'POST',
    headers: myHeaders,
    body,
  };

  try {
    const response = await fetch('http://localhost:5000/auth/password', request);
    if (response.status === 401)
      throw Error(`Ошибка чтения юзеров ${response.status} ${response.statusText} `);
    if (response.ok) {
      const res = await response.json();
      localStorage.setItem('refreshToken', res.refreshToken);
      commonVars.accessToken = res.accessToken;
      return true;
    } else return false;
  } catch (e: any) {
    console.log(e.message);
    return false;
  }
}
