import './updatePrognose.scss';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Prognose } from '../../../../interfaces/interfaces';
import { appState } from '../../../../constants';

import updatePrognoseHandle from './updatePrognoseHandle';
import ScoreEditModalBase from '../../../common/ScoreEditModalBase';

const UpdatePrognose = (props: {
  prognose: Prognose;
  updateCellPrognose?: Function;
  updateLinePrognose?: Function;
  /** Обновить данные в родителе (таблица турнира и т.п.) до закрытия модалки */
  onPrognoseSaved?: (
    p: Prognose,
    extras?: { result?: number; resultCup?: number }
  ) => void;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const [initialScore, setInitialScore] = useState({
    team1:
      typeof props.prognose.team1_result === 'number' ? props.prognose.team1_result : undefined,
    team2:
      typeof props.prognose.team2_result === 'number' ? props.prognose.team2_result : undefined,
  });

  useEffect(() => {
    setInitialScore({
      team1:
        typeof props.prognose.team1_result === 'number' ? props.prognose.team1_result : undefined,
      team2:
        typeof props.prognose.team2_result === 'number' ? props.prognose.team2_result : undefined,
    });
  }, [props.prognose.game?.id, props.prognose.team1_result, props.prognose.team2_result]);

  return (
    <ScoreEditModalBase
      title="Enter your prognose"
      team1Name={props.prognose.game.team1?.name}
      team2Name={props.prognose.game.team2?.name}
      team1Id={props.prognose.game.team1?.id}
      team2Id={props.prognose.game.team2?.id}
      initialScore={initialScore}
      resetKey={props.prognose.id ?? props.prognose.game?.id}
      onSubmit={handleSubmitButton}
    />
  );

  async function handleSubmitButton(score: { team1?: number; team2?: number }) {
    const newPrognose: Prognose = {
      id: undefined,
      gameID: props.prognose.game.id,
      game: props.prognose.game,
      team1_result: score.team1,
      team2_result: score.team2,
      userOnTournamentTournamentID:
        props.prognose.userOnTournamentTournamentID ??
        appState.currentTournamentID ??
        appState.currentTournament?.id,
      userOnTournamentUserID: props.prognose.userOnTournamentUserID ?? appState.userID,
    };

    if (props.prognose.id != null) newPrognose.id = props.prognose.id;

    let saved: Awaited<ReturnType<typeof updatePrognoseHandle>>;
    try {
      saved = await updatePrognoseHandle(newPrognose);
    } catch {
      // Ошибка уже показана через notifyError внутри updatePrognoseHandle.
      // Не пробрасываем дальше, чтобы не ловить "красный" оверлей React (Unhandled promise rejection).
      return;
    }
    const merged: Prognose = {
      ...newPrognose,
      game: newPrognose.game,
    };
    const savedPrognose = saved?.prognose;
    if (savedPrognose) {
      if (savedPrognose.id != null && Number.isFinite(Number(savedPrognose.id))) {
        merged.id = Number(savedPrognose.id);
      }
      if (typeof savedPrognose.team1_result === 'number') merged.team1_result = savedPrognose.team1_result;
      if (typeof savedPrognose.team2_result === 'number') merged.team2_result = savedPrognose.team2_result;
      if (typeof savedPrognose.result === 'number') merged.result = savedPrognose.result;
      else if (savedPrognose.result === null) merged.result = undefined;
    }

    const userStats = saved?.userOnTournament;
    const extras =
      userStats &&
      (typeof userStats.result === 'number' || typeof userStats.resultCup === 'number')
        ? {
            result: typeof userStats.result === 'number' ? userStats.result : undefined,
            resultCup: typeof userStats.resultCup === 'number' ? userStats.resultCup : undefined,
          }
        : undefined;

    if (props.onPrognoseSaved) props.onPrognoseSaved(merged, extras);
    if (props.updateCellPrognose) props.updateCellPrognose(merged);
    if (props.updateLinePrognose) props.updateLinePrognose(merged);

    props.setShowModal(false);
  }
};
export default UpdatePrognose;
