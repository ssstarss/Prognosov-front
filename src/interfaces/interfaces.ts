import { Tournament, User } from '../Components/Pages/FillBase/types';

type Credetials = {
  email: string;
  password: string;
};

export type RegisterFormData = {
  fio: string;
  email: string;
  password?: string;
  cellphone: string;
  city: string;
  country: string;
};

type Team = {
  id?: number;
  name: string;
  country: string;
  type: string;
};

type Prognose = {
  id: number | undefined;
  gameID: number;
  game: Game;
  team1_result?: number;
  team2_result?: number;
  userOnTournamentTournamentID?: number;
  userOnTournamentUserID?: number;
  result?: number;
};

type Game = {
  id: number;
  starts_at: Date;
  competitionID: number;
  team1?: Team;
  team2?: Team;
  team1_result?: number;
  team2_result?: number;
  prognoses?: Prognose[];
};



export { Credetials, Team, Prognose, Game };
