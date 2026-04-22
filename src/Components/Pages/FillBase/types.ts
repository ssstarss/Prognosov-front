import { Game, Prognose } from '../../../interfaces/interfaces';

type Competition = {
  id: number;
  name: string;
  comments: string;
  games?: Game[];
  active: boolean;
};

type Team = {
  id: number;
  name: string;
  country: string;
  type: string;
  avatar?: Uint8Array | string | null;
};

type Tournament = {
  id: number;
  name: string;
  competitionID: number;
  comments: string;
  active: boolean;
  competition?: Competition;
  usersOnTournament?: UserOnTournament[];
  roomAdminID?: number;
};

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  cellphone: string;
  avatar?: Uint8Array | string | null;
  role?: string;
  city?: string;
  country?: string;
  tournaments?: UserOnTournament[];
  active: boolean;
}

interface UserOnTournament {
  result: number;
  resultCup: number;
  prognoses?: Prognose[];
  userID: number;
  tournamentID: number;
  user: User;
  tournament: Tournament;
}
export { User, Tournament, Competition, Team, UserOnTournament };
