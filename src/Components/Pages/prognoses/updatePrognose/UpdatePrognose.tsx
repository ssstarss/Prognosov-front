import './updatePrognose.css';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Prognose } from '../../../../interfaces/interfaces';
import { appState } from '../../../../constants';

import updatePrognoseHandle from './updatePrognoseHandle';

const UpdatePrognose = (props: {
  prognose: Prognose;
  updateCellPrognose?: Function;
  updateLinePrognose?: Function;
  /** Обновить данные в родителе (таблица турнира и т.п.) до закрытия модалки */
  onPrognoseSaved?: (p: Prognose) => void;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const [currentScore, setCurrentScore] = useState({
    team1:
      typeof props.prognose.team1_result === 'number' ? props.prognose.team1_result : undefined,
    team2:
      typeof props.prognose.team2_result === 'number' ? props.prognose.team2_result : undefined,
  });

  useEffect(() => {
    setCurrentScore({
      team1:
        typeof props.prognose.team1_result === 'number' ? props.prognose.team1_result : undefined,
      team2:
        typeof props.prognose.team2_result === 'number' ? props.prognose.team2_result : undefined,
    });
  }, [props.prognose.game?.id, props.prognose.team1_result, props.prognose.team2_result]);

  return (
    <div
      className="updatePrognoseWrapper"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleSubmitButton();
      }}
    >
      <h2 className="updatePrognoseHeader">Enter your prognose</h2>
      <div className="prognoseWrapper">
        <div className="prognoseTeamWrapper">
          <h4 className="prognoseTeamName">{props.prognose.game.team1?.name}</h4>
          <input
            type="number"
            className="prognoseResultInput"
            value={currentScore.team1}
            pattern="^(\d+$)"
            onChange={(e) => onResultChange(e, 1)}
          ></input>
        </div>
        <div className="prognoseTeamWrapper">
          <input
            type="number"
            className="prognoseResultInput"
            value={currentScore.team2}
            pattern="^(\d+$)"
            onChange={(e) => onResultChange(e, 2)}
          ></input>
          <h5 className="prognoseTeamName">{props.prognose.game.team2?.name}</h5>
        </div>
      </div>
      <button className="submitFormButton" onClick={() => handleSubmitButton()}>
        Submit
      </button>
    </div>
  );
  function onResultChange(e: React.ChangeEvent<HTMLInputElement>, team: number) {
    const result = Number(e.target.value);
    if (team === 1) setCurrentScore({ team1: result, team2: currentScore.team2 });
    else setCurrentScore({ team1: currentScore.team1, team2: result });
  }

  async function handleSubmitButton() {
    const newPrognose: Prognose = {
      id: undefined,
      gameID: props.prognose.game.id,
      game: props.prognose.game,
      team1_result: currentScore.team1,
      team2_result: currentScore.team2,
      userOnTournamentTournamentID:
        props.prognose.userOnTournamentTournamentID ??
        appState.currentTournamentID ??
        appState.currentTournament?.id,
      userOnTournamentUserID: props.prognose.userOnTournamentUserID ?? appState.userID,
      result: 0,
    };

    if (props.prognose.id != null) newPrognose.id = props.prognose.id;

    const saved = await updatePrognoseHandle(newPrognose);
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
