import { Tournament, User } from '../Components/Pages/FillBase/types';

type Credetials = {
  email: string;
  password: string;
};

type Team = {
  id?: number;
  name: string;
  country: string;
  type: string;
};

type Prognose = {
  id: number | undefined;
  matchID: number;
  match?: Match;
  team1_result: number;
  team2_result: number;
  tournamentID: number;
  userID: number;
  user?: User;
  result?: number;
};

type Match = {
  id: number;
  starts_at: Date;
  competitionID: number;
  team1?: Team;
  team2?: Team;
  team1_result?: number;
  team2_result?: number;
  prognoses?: Prognose[];
};

type UserOnTournament = {
  userID: number;
  tournamentID: number;
  user?: User;
  tournament?: Tournament;
};

export { Credetials, Team, Prognose, Match, UserOnTournament };
