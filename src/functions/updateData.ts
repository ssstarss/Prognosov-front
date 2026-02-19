import { appState } from '../constants';
import { Team } from '../interfaces/interfaces';
import { User } from '../Components/Pages/FillBase/types';

export const updateData = async (host: string, data: Team | User) => {
  const myHeaders = {
    Accept: 'application/json',
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + appState.accessToken,
  };

  const body = JSON.stringify(data);
  const request = {
    method: 'PUT',
    headers: myHeaders,
    body,
  };
  try {
    console.log('Sending PUT request to:', host);
    console.log('Request body:', body);
    
    const response = await fetch(host, request);

    console.log('Response status:', response.status);
    console.log('Response statusText:', response.statusText);

    if (response.status === 401)
      throw Error(`Error reading ${host} ${response.status} ${response.statusText} `);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', errorText);
      throw Error(`Error updating ${host}: ${response.status} ${response.statusText}. ${errorText}`);
    }
    
    const res = await response.json();
    console.log('result in update', response.status);
    return response.status;
  } catch (e: any) {
    console.error('Update error:', e.message);
    throw e;
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
