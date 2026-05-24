import { Game } from '../interfaces/interfaces';
import { appState } from '../constants';

/** Тот же порог, что на бэке: `PREDICTION_LOCK_LEAD_MS` (1 час). */
const PREDICTION_LOCK_LEAD_MS = 60 * 60 * 1000;

export function isGamePredictionClosedFromCompetition(
  startsAt: Date | string | null | undefined,
  nowMs = Date.now()
): boolean {
  if (startsAt == null) return false;
  const startMs = new Date(startsAt).getTime();
  if (!Number.isFinite(startMs)) return false;
  return nowMs >= startMs - PREDICTION_LOCK_LEAD_MS;
}

/** Чужой прогноз виден, если матч «закрыт» по времени из competition.games. */
export function canViewerSeeForeignPrognose(
  ownerUserId: number,
  gameStartsAt: Date | string | null | undefined
): boolean {
  if (appState.userID === ownerUserId) return true;
  return isGamePredictionClosedFromCompetition(gameStartsAt);
}

export function gameByIdFromCompetition(games: Game[] | undefined): Map<number, Game> {
  const map = new Map<number, Game>();
  for (const g of games ?? []) {
    if (g.id != null) map.set(g.id, g);
  }
  return map;
}
