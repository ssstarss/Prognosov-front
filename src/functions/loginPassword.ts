import { Credetials } from '../interfaces/interfaces';
import { appState, SERVER } from '../constants';
import loginRefresh from './loginRefresh';
import { notifyError } from '../Components/common/notifications/notificationBus';
import { readErrorMessage } from './errorMessage';
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
    if (!response.ok) {
      const fallback = response.status === 401 ? 'Неверный email или пароль' : 'Ошибка авторизации';
      const message = await readErrorMessage(response, fallback);
      notifyError(message);
      return false;
    }
    if (response.ok) {
      const res = await response.json();
      localStorage.setItem('refreshToken', res.refreshToken);
      await loginRefresh()
      


      return true;
    } else return false;
  } catch (e: any) {
    notifyError(e?.message || 'Ошибка авторизации');
    console.log(e.message);
    return false;
  }
}
