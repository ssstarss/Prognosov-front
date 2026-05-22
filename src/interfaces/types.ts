import { Game, Prognose } from './interfaces';

type Competition = {
  id: number;
  name: string;
  comments: string;
  games?: Game[];
  active: boolean;
  avatar?: Uint8Array | string | null;
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

interface UserProfile {
  id: number;
  name: string;
  email: string;
  cellphone: string;
  avatar?: Uint8Array | string | null;
  role?: string;
  city?: string;
  country?: string;
}

interface UserOnTournament {
  id?: number;
  result: number;
  resultCup: number;
  prognoses?: Prognose[];
  userID: number;
  tournamentID: number;
  user: User;
  tournament?: Tournament;
}
export { User, UserProfile, Tournament, Competition, Team, UserOnTournament };
