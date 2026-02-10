import './updatePrognose.css';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Match, Prognose } from '../../interfaces/interfaces';
import { appState } from '../../constants';
import { close__popUp } from '../PopUpCanvas/popUpCanvas';
import updatePrognoseHandle from './updatePrognoseHandle';

const UpdatePrognose = (props: { match: Match; setMatch: Dispatch<SetStateAction<Match>> }) => {
  const [currentScore, setCurrentScore] = useState({ team1: 0, team2: 0 });

  useEffect(() => {
    if (props.match.prognoses) {
      setCurrentScore(
        props.match.prognoses.length > 0
          ? {
              team1: props.match.prognoses[0].team1_result,
              team2: props.match.prognoses[0].team2_result,
            }
          : { team1: 0, team2: 0 }
      );
    }
  }, [props.match]);

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
            <h4 className="prognoseTeamName">{props.match.team1?.name}</h4>
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
            <h5 className="prognoseTeamName">{props.match.team2?.name}</h5>
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
    const prognose: Prognose = {
      id: undefined,
      matchID: props.match.id,
      team1_result: currentScore.team1,
      team2_result: currentScore.team2,
      tournamentID: 1,
      userID: appState.userID,
    };
    if (props.match.prognoses)
      if (props.match.prognoses.length > 0) prognose.id = props.match.prognoses[0].id;
    const updatedMatch = await updatePrognoseHandle(prognose);
    props.setMatch({ ...props.match, ...updatedMatch });
    closeWindow();
  }

  function closeWindow() {
    const element = document.getElementById('updatePrognoseCanvas');
    if (element) element.style.display = 'none';
    close__popUp();
  }
};
export default UpdatePrognose;
