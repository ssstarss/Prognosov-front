import { RegisterFormData, Team } from '../interfaces/interfaces';
import { Competition, User, UserProfile, Tournament, UserOnTournament } from '../interfaces/types';
import { apiRequest } from './apiRequest';

export const updateData = async (
  host: string,
  data: Team | User | UserProfile | Partial<User> | Competition | Tournament
) => {
  const result = await apiRequest({
    host,
    method: 'PUT',
    body: data,
    errorMessage: `Ошибка обновления данных: ${host}`,
    rethrow: true,
  });
  return result?.status;
};

export const deleteData = async (host: string, data: UserOnTournament) => {
  const result = await apiRequest({
    host,
    method: 'DELETE',
    errorMessage: `Ошибка удаления данных: ${host}`,
  });
  return result?.status;
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
    | { data: UserOnTournament }
) => {
  console.log('body in addData', JSON.stringify(data));
  const result = await apiRequest({
    host,
    method: 'POST',
    body: data,
    errorMessage: `Ошибка добавления данных: ${host}`,
  });
  if (result) console.log('result in add', result.status);
  return result?.status;
};
