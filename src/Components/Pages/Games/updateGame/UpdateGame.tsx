import './updateGame.css';
import React, { useEffect, useState } from 'react';
import { Game } from '../../../../interfaces/interfaces';
import { appState } from '../../../../constants';
import { close__popUp } from '../../../PopUpCanvas/popUpCanvas';
import updateGameHandle from './updateGameHandle';

const UpdateGame = (props: {
  game: Game;
  updateCellGame?: Function;
  updateLineGame?: Function;
}) => {
  const [currentScore, setCurrentScore] = useState({
    team1: typeof props.game.team1_result === 'number' ? props.game.team1_result : undefined,
    team2: typeof props.game.team2_result === 'number' ? props.game.team2_result : undefined,
  });

  useEffect(() => {
    setCurrentScore({
      team1: typeof props.game.team1_result === 'number' ? props.game.team1_result : undefined,
      team2: typeof props.game.team2_result === 'number' ? props.game.team2_result : undefined,
    });
  }, [props.game?.id, props.game.team1_result, props.game.team2_result]);

  return (
    <div className="updateGameCanvas" id="updateGameCanvas" onClick={closeWindow}>
      <div
        className="updateGameWrapper"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmitButton();
        }}
      >
        <h2 className="updateGameHeader">Enter your game</h2>
        <div className="gameWrapper">
          <div className="gameTeamWrapper">
            <h4 className="gameTeamName">{props.game.team1?.name}</h4>
            <input
              type="number"
              className="gameResultInput"
              value={currentScore.team1}
              pattern="^(\d+$)"
              onChange={(e) => onResultChange(e, 1)}
            ></input>
          </div>
          <div className="gameTeamWrapper">
            <input
              type="number"
              className="gameResultInput"
              value={currentScore.team2}
              pattern="^(\d+$)"
              onChange={(e) => onResultChange(e, 2)}
            ></input>
            <h5 className="gameTeamName">{props.game.team2?.name}</h5>
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
    const newGame: Game = {
      id: props.game.id,
      starts_at: props.game.starts_at,
      competitionID: props.game.competitionID,

      team1_result: currentScore.team1,
      team2_result: currentScore.team2,
    };

    

    await updateGameHandle(newGame);

    if (props.updateLineGame) props.updateLineGame({ ...newGame });

    closeWindow();
  }

  function closeWindow() {
    const element = document.getElementById('updateGameCanvas');
    if (element) element.style.display = 'none';
    close__popUp();
  }
};
export default UpdateGame;
