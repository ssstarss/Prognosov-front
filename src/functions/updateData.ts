import { appState } from '../constants';
import { Team } from '../interfaces/interfaces';

export const updateData = async (host: string, team: Team) => {
  const myHeaders = {
    Accept: 'application/json',
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + appState.accessToken,
  };

  const body = JSON.stringify(team);
  const request = {
    method: 'PUT',
    headers: myHeaders,
    body,
  };
  try {
    const response = await fetch(host, request);

    if (response.status === 401)
      throw Error(`Error reading ${host} ${response.status} ${response.statusText} `);
    const res = await response.json();
    console.log('result in update', response.status);
    return response.status;
  } catch (e: any) {
    console.log(e.message);
  }
};
export const deleteData = async (host: string, team: Team) => {
  const myHeaders = {
    Accept: 'application/json',
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + appState.accessToken,
  };

  host += '/' + team.id;
  const body = JSON.stringify(team);
  const request = {
    method: 'DELETE',
    headers: myHeaders,
  };
  try {
    const response = await fetch(host, request);

    if (response.status === 401)
      throw Error(`Error reading ${host} ${response.status} ${response.statusText} `);
    const res = await response.json();
    return response.status;
  } catch (e: any) {
    console.log(e.message);
  }
};

export const addData = async (host: string, team: Team) => {
  const myHeaders = {
    Accept: 'application/json',
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + appState.accessToken,
  };

  const body = JSON.stringify(team);
  const request = {
    method: 'POST',
    headers: myHeaders,
    body,
  };
  try {
    const response = await fetch(host, request);

    if (response.status === 401)
      throw Error(`Error reading ${host} ${response.status} ${response.statusText} `);
    const res = await response.json();
    console.log('result in add', response.status);
    return response.status;
  } catch (e: any) {
    console.log(e.message);
  }
};
