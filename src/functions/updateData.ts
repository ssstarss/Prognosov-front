import { appState } from '../constants';
import { Team } from '../interfaces/interfaces';
import {
  Competition,
  User,
  Tournament,
  UserOnTournament,
} from '../Components/Pages/FillBase/types';
import { SERVER } from '../constants';

export const updateData = async (host: string, data: Team | User | Competition | Tournament) => {
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
    const response = await fetch(SERVER + host, request);

    if (response.status === 401)
      throw Error(`Error reading ${SERVER + host} ${response.status} ${response.statusText} `);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', errorText);
      throw Error(
        `Error updating ${SERVER + host}: ${response.status} ${response.statusText}. ${errorText}`
      );
    }

    const res = await response.json();

    return response.status;
  } catch (e: any) {
    console.error('Update error:', e.message);
    throw e;
  }
};
export const deleteData = async (host: string, data: UserOnTournament) => {
  const myHeaders = {
    Accept: 'application/json',
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + appState.accessToken,
  };

  const request = {
    method: 'DELETE',
    headers: myHeaders,
  };
  try {
    const response = await fetch(SERVER + host, request);

    if (response.status === 401)
      throw Error(`Error reading ${SERVER + host} ${response.status} ${response.statusText} `);
    const res = await response.json();
    return response.status;
  } catch (e: any) {
    console.log(e.message);
  }
};

export const addData = async (
  host: string,
  data: Team | Omit<Competition, 'id'> | Omit<Tournament, 'id'> | {
      
    team1_id: number,
    team2_id: number,
    starts_at: Date,
    competitionID: number,
  }
) => {
  const myHeaders = {
    Accept: 'application/json',
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + appState.accessToken,
  };

  const body = JSON.stringify(data);
  const request = {
    method: 'POST',
    headers: myHeaders,
    body,
  };
  try {
    const response = await fetch(SERVER + host, request);

    if (response.status === 401)
      throw Error(`Error reading ${SERVER + host} ${response.status} ${response.statusText} `);
    const res = await response.json();
    console.log('result in add', response.status);
    return response.status;
  } catch (e: any) {
    console.log(e.message);
  }
};
