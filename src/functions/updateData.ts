import { appState } from '../constants';
import { RegisterFormData, Team } from '../interfaces/interfaces';
import { Competition, User, UserProfile, Tournament, UserOnTournament } from '../interfaces/types';
import { SERVER } from '../constants';
import { notifyError } from '../Components/common/notifications/notificationBus';
import { readErrorMessage } from './errorMessage';

export const updateData = async (
  host: string,
  data: Team | User | UserProfile | Partial<User> | Competition | Tournament
) => {
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
      const message = await readErrorMessage(response, `Ошибка обновления данных: ${host}`);
      throw Error(message);
    }

    const res = await response.json();

    return response.status;
  } catch (e: any) {
    notifyError(e?.message || `Ошибка обновления данных: ${host}`);
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

    if (!response.ok) {
      const message = await readErrorMessage(response, `Ошибка удаления данных: ${host}`);
      throw Error(message);
    }
    const res = await response.json();
    return response.status;
  } catch (e: any) {
    notifyError(e?.message || `Ошибка удаления данных: ${host}`);
    console.log(e.message);
  }
};

export const addData = async (
  host: string,
  data:
    | Team
    | Omit<Competition, 'id'>
    | Omit<Tournament, 'id'>
    | {
        team1_id: number;
        team2_id: number;
        starts_at: Date;
        competitionID: number;
      }
    | UserOnTournament
    | { data: RegisterFormData & { active: boolean; id: number; role?: string } }
    | { data: UserOnTournament  }
) => {
  const myHeaders = {
    Accept: 'application/json',
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + appState.accessToken,
  };

  const body = JSON.stringify(data);
  console.log('body in addData', body);
  const request = {
    method: 'POST',
    headers: myHeaders,
    body,
  };
  try {
    const response = await fetch(SERVER + host, request);

    if (!response.ok) {
      const message = await readErrorMessage(response, `Ошибка добавления данных: ${host}`);
      throw Error(message);
    }
    const res = await response.json();
    console.log('result in add', response.status);
    return response.status;
  } catch (e: any) {
    notifyError(e?.message || `Ошибка добавления данных: ${host}`);
    console.log(e.message);
  }
};
