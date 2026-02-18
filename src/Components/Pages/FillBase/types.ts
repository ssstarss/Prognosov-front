import { Game, Prognose } from '../../../interfaces/interfaces';

type Competition = {
  id: number;
  name: string;
  comments: string;
  StartsAt: string | Date;
  EndsAt: string | Date;
  games?: Game[];
};

type Team = {
  id: number;
  name: string;
  country: string;
  type: string;
};

type Tournament = {
  id: number;
  name: string;
  competitionID: number;
  comments: string;
  active: boolean;
  competition?: Competition;
  usersOnTournament?: UserOnTournament[]
  
};


interface User {
  id: number;
  fio: string;
  email: string;
  password: string;
  cellphone: string;
  role: string;
  city: string;
  country: string;
  tournaments?: UserOnTournament[]
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
