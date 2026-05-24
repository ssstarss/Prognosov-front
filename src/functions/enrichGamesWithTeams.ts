import { Game, Team } from '../interfaces/interfaces';

export type TeamsById = Map<number, Team>;

export function teamsArrayToMap(teams: Team[]): TeamsById {
  const map: TeamsById = new Map();
  for (const team of teams) {
    if (team.id != null) map.set(team.id, team);
  }
  return map;
}

export function getGameTeam1Id(game: Game): number | undefined {
  const id = game.team1_id ?? game.team1?.id;
  return typeof id === 'number' && Number.isFinite(id) ? id : undefined;
}

export function getGameTeam2Id(game: Game): number | undefined {
  const id = game.team2_id ?? game.team2?.id;
  return typeof id === 'number' && Number.isFinite(id) ? id : undefined;
}

export function enrichGameWithTeams(game: Game, teamsById: TeamsById): Game {
  const team1Id = getGameTeam1Id(game);
  const team2Id = getGameTeam2Id(game);
  return {
    ...game,
    team1_id: team1Id,
    team2_id: team2Id,
    team1: team1Id != null ? teamsById.get(team1Id) ?? game.team1 : game.team1,
    team2: team2Id != null ? teamsById.get(team2Id) ?? game.team2 : game.team2,
  };
}

export function enrichGamesWithTeams(games: Game[], teams: Team[]): Game[] {
  const teamsById = teamsArrayToMap(teams);
  return games.map((game) => enrichGameWithTeams(game, teamsById));
}
