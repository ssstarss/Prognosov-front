import { Match, Prognose } from '../../../interfaces/interfaces';

type Competition = {
  id: number;
  name: string;
  comments: string;
  StartsAt: string | Date;
  EndsAt: string | Date;
  matches?: Match[];
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
  users: User[];
  competition?: Competition;
  results: Result[];
};

interface Result {
  result: number;
  userID: number;
  tournamentID: number;
}
interface User {
  id: number;
  fio: string;
  email: string;
  password: string;
  cellphone: string;
  role: string;
  city: string;
  country: string;
  tournaments?: Tournament[];
  prognoses: Prognose[];
  results: Result[];
}
export { User, Tournament, Competition, Team, Result };
