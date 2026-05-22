import { Competition, Tournament, UserOnTournament } from './interfaces/types';
export const appState = {
  accessToken: '',
  userID: 0,
  userRole: 'user',
  currentCompetitionID: 1,
  currentCompetition: {} as Competition,
  currentTournamentID: 1,
  currentTournament: {} as Tournament,
  usersOnTournament: [] as UserOnTournament[],
  deadlineMinutes: 60,
};

export const SERVER = process.env.SERVER_URL;
