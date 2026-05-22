import { Competition } from '../interfaces/types';
import { Game, Team } from '../interfaces/interfaces';
import fetchData from './fetchData';
import { enrichGamesWithTeams } from './enrichGamesWithTeams';

/** Игры соревнования + команды одним набором (параллельные запросы, без дубля аватаров в JSON). */
export async function fetchGamesWithTeams(competitionId: number): Promise<Game[]> {
  const [games, teams] = await Promise.all([
    fetchData(`/matches/${competitionId}`) as Promise<Game[] | undefined>,
    fetchData(`/teams/by-competition/${competitionId}`) as Promise<Team[] | undefined>,
  ]);
  return enrichGamesWithTeams(Array.isArray(games) ? games : [], Array.isArray(teams) ? teams : []);
}

export async function fetchCompetitionWithGamesAndTeams(
  competitionId: number
): Promise<Competition | undefined> {
  const [competition, teams] = await Promise.all([
    fetchData(`/competitions/${competitionId}`) as Promise<Competition | undefined>,
    fetchData(`/teams/by-competition/${competitionId}`) as Promise<Team[] | undefined>,
  ]);
  if (!competition) return undefined;
  const games = enrichGamesWithTeams(
    Array.isArray(competition.games) ? competition.games : [],
    Array.isArray(teams) ? teams : []
  );
  return { ...competition, games };
}
