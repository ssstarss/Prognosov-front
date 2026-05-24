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
  onPrognoseSaved?: (p: Prognose) => void;
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
      team1Avatar={props.prognose.game.team1?.avatar}
      team2Avatar={props.prognose.game.team2?.avatar}
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

    let saved: unknown;
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
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      const s = saved as Record<string, unknown>;
      if (s.id != null && Number.isFinite(Number(s.id))) merged.id = Number(s.id);
      if (typeof s.team1_result === 'number') merged.team1_result = s.team1_result;
      if (typeof s.team2_result === 'number') merged.team2_result = s.team2_result;
      if (typeof s.result === 'number') merged.result = s.result;
    }

    if (props.onPrognoseSaved) props.onPrognoseSaved(merged);
    if (props.updateCellPrognose) props.updateCellPrognose(merged);
    if (props.updateLinePrognose) props.updateLinePrognose(merged);

    props.setShowModal(false);
  }
};
export default UpdatePrognose;
