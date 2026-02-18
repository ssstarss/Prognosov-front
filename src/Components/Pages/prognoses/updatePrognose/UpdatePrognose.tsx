import './updatePrognose.css';
import React, { useEffect, useState } from 'react';
import { Prognose } from '../../../../interfaces/interfaces';
import { appState } from '../../../../constants';
import { close__popUp } from '../../../PopUpCanvas/popUpCanvas';
import updatePrognoseHandle from './updatePrognoseHandle';

const UpdatePrognose = (props: {
  prognose: Prognose;
  updateCellPrognose?: Function;
  updateLinePrognose?: Function;
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
    <div className="updatePrognoseCanvas" id="updatePrognoseCanvas" onClick={closeWindow}>
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
      userOnTournamentTournamentID: 1,
      userOnTournamentUserID: appState.userID,
      result: 0,
    };

    if (props.prognose.id) newPrognose.id = props.prognose.id;

    await updatePrognoseHandle(newPrognose);
    if (props.updateCellPrognose) props.updateCellPrognose({ ...newPrognose });
    if (props.updateLinePrognose) props.updateLinePrognose({ ...newPrognose });

    closeWindow();
  }

  function closeWindow() {
    const element = document.getElementById('updatePrognoseCanvas');
    if (element) element.style.display = 'none';
    close__popUp();
  }
};
export default UpdatePrognose;
