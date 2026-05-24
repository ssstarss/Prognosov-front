import { Prognose } from '../../../../interfaces/interfaces';
import { appState } from '../../../../constants';
import { apiRequest } from '../../../../functions/apiRequest';

/** Только поля для API: без вложенного game (иначе циклы game.prognoses → JSON.stringify падает). */
function leanPrognosePayload(prognose: Prognose): Record<string, unknown> {
  const t1 =
    typeof prognose.team1_result === 'number' && !Number.isNaN(prognose.team1_result)
      ? prognose.team1_result
      : 0;
  const t2 =
    typeof prognose.team2_result === 'number' && !Number.isNaN(prognose.team2_result)
      ? prognose.team2_result
      : 0;
  const tournamentId =
    prognose.userOnTournamentTournamentID ??
    appState.currentTournamentID ??
    appState.currentTournament?.id;
  const userId = prognose.userOnTournamentUserID ?? appState.userID;
  if (tournamentId == null || userId == null) {
    throw new Error('Не заданы userOnTournamentUserID или userOnTournamentTournamentID для прогноза');
  }
  const payload: Record<string, unknown> = {
    gameID: prognose.gameID,
    team1_result: t1,
    team2_result: t2,
    userOnTournamentTournamentID: tournamentId,
    userOnTournamentUserID: userId,
    result: typeof prognose.result === 'number' && !Number.isNaN(prognose.result) ? prognose.result : 0,
  };
  if (prognose.id != null) payload.id = prognose.id;
  return payload;
}

export default async function updatePrognoseHandle(prognose: Prognose) {
  const result = await apiRequest({
    host: '/prognoses',
    method: prognose.id != null ? 'PUT' : 'POST',
    body: leanPrognosePayload(prognose),
    errorMessage: 'Ошибка сохранения прогноза',
    rethrow: true,
  });
  return result?.data;
}
