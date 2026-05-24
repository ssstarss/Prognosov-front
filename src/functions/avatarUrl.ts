import { SERVER } from '../constants';

export function userAvatarUrl(userId: number): string {
  return `${SERVER}/users/${userId}/avatar`;
}

export function teamAvatarUrl(teamId: number): string {
  return `${SERVER}/teams/${teamId}/avatar`;
}

export function competitionAvatarUrl(competitionId: number): string {
  return `${SERVER}/competitions/${competitionId}/avatar`;
}
