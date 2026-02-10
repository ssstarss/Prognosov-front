import { appState } from '../constants';
import { SERVER } from '../constants';

const fetchData = async (host: string, setFunc?:Function) => {
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
    const response = await fetch(URL, request);
    if (response.status === 401)
      throw Error(`Error reading ${host} ${response.status} ${response.statusText} `);

    const res = await response.json();

    if (setFunc) setFunc(res);
    return res;
  } catch (e: any) {
    console.log(e.message);
  }
};
export default fetchData;
