import { commonVars } from '../constants';

async function loginRefresh() {
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
      const response = await fetch('http://localhost:5000/auth/refresh', request);
      const res = await response.json();
      commonVars.accessToken = res.accessToken;
    } catch (e: any) {
      console.log('loginpage error refresh');
    }
    return true;
  }
  return false;
}

export default loginRefresh;
