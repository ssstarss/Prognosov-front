import { Competition, Tournament, UserOnTournament } from './Components/Pages/FillBase/types';
export const appState = {
  accessToken: '',
  userID: 0,
  userRole: 'user',
  currentCompetitionID: 1,
  currentCompetition: {} as Competition,
  currentTournamentID: 1,
  currentTournament: {} as Tournament,
  usersOnTournament: [] as UserOnTournament[],
  deadlineMinutes: 15,
};

export const SERVER = 'http://localhost:5000';
