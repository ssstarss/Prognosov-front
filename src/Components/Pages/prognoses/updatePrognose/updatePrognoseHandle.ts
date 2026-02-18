import { Prognose } from '../../../../interfaces/interfaces';
import { appState } from '../../../../constants';
import { SERVER } from '../../../../constants';

export default async function updatePrognoseHandle(prognose: Prognose) {
  const body = JSON.stringify(prognose);
  const myHeaders = {
    Accept: 'application/json',
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + appState.accessToken,
  };
  const request = {
    method: 'POST',
    headers: myHeaders,
    body,
  };
  if (prognose.id) request.method = 'PUT';
  try {
    const response = await fetch(`${SERVER}/prognoses/`, request);
    if (response.status === 401)
      throw Error(`Error creating prognoses ${response.status} ${response.statusText} `);
    const result = await response.json();
    return result;
  } catch (e: any) {
    console.log(e.message);
  }
}
