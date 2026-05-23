import { appState } from '../constants';
import { SERVER } from '../constants';
import { notifyError } from '../Components/common/notifications/notificationBus';
import { readErrorMessage } from './errorMessage';
import { apiFetch } from './apiClient';

const fetchData = async (host: string, setFunc?: Function) => {
  const myHeaders = {
    Accept: 'application/json',
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + appState.accessToken,
  };
  let URL = SERVER + host;
  const request = {
    method: 'GET',
    headers: myHeaders,
  };

  try {
    const response = await apiFetch(URL, request);
    if (!response.ok) {
      const message = await readErrorMessage(response, `Ошибка загрузки данных: ${host}`);
      throw Error(message);
    }

    const res = await response.json();

    if (setFunc) {console.log('res in fetchData', setFunc.name, res); setFunc(res);}
    return res;
  } catch (e: any) {
    notifyError(e?.message || `Ошибка загрузки данных: ${host}`);
    console.log(e.message);
  }
};
export default fetchData;
