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

  team1_result: number;

  team2_result: number;
  tournamentID: number;
  userID: number;
};

type Match = {
  id: number;
  starts_at: Date;
  competitionID: number;
  team1?: Team;
  team2?: Team;
  prognoses: Prognose[];
};

export { Credetials, Team, Prognose, Match };
