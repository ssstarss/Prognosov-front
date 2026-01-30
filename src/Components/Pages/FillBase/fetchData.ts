import { appState, SERVER } from '../../../constants';
import { User, Tournament, Competition, Team } from './types';
import { Match, UserOnTournament } from '../../../interfaces/interfaces';

const deleteData = async (host: string) => {
  const myHeaders = {
    Accept: 'application/json',
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + appState.accessToken,
  };

  let request = {
    method: 'DELETE',
    headers: myHeaders,
  };

  try {
    const response = await fetch(SERVER + host, request);
    if (response.status === 401)
      throw Error(`Error deleting ${host} ${response.status} ${response.statusText} `);
    const res = await response.json();
    return res;
  } catch (e: any) {
    console.log(`Error deleting ${host} :`, e.message);
  }
};
const createData = async (
  host: string,
  data: Match[] | User[] | Tournament[] | Competition[] | Team[] | UserOnTournament[]
) => {
  const myHeaders = {
    Accept: 'application/json',
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + appState.accessToken,
  };

  const body = JSON.stringify({
    data,
  });

  let request = {
    method: 'POST',
    headers: myHeaders,
    body,
  };

  try {
    const response = await fetch(SERVER + host, request);
    if (response.status === 401)
      throw Error(`Error creating ${host} ${response.status} ${response.statusText} `);
    const res = await response.json();
    return res;
  } catch (e: any) {
    console.log(`Error creating  ${host} :`, e.message);
  }
};

export { deleteData, createData };
