import { Tournament, User } from '../Components/Pages/FillBase/types';

type Credetials = {
  email: string;
  password: string;
};

export type RegisterFormData = {
  name: string;
  email: string;
  password?: string;
  cellphone: string;
  city?: string;
  country?: string;
  avatar?: string | null;
};

type Team = {
  id?: number;
  name: string;
  country: string;
  type: string;
  avatar?: Uint8Array | string | null;
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
  cup?: boolean;
  prognoses?: Prognose[];
};



export { Credetials, Team, Prognose, Game };
