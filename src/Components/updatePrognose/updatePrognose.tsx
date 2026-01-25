import './updatePrognose.css';
import React, { useEffect, useState } from 'react';
import fetchData from '../../functions/fetchData';
import { Match, Prognose } from '../../interfaces/interfaces';
import { appState, SERVER } from '../../constants';

type Props = {
  match: Match;
  setMatches: Function;
};
const UpdatePrognose: React.FC<Props> = ({ match, setMatches }) => {
  console.log('MATCH:', match.prognoses.length, match.prognoses);

  const [currentScore, setCurrentScore] = useState({ team1: 0, team2: 0 });
  useEffect(
    () =>
      setCurrentScore(
        match.prognoses.length > 0
          ? {
              team1: match.prognoses[0].team1_result,
              team2: match.prognoses[0].team2_result,
            }
          : { team1: 0, team2: 0 }
      ),
    [match]
  );

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
            <h4 className="prognoseTeamName">{match.team1?.name}</h4>
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
            <h5 className="prognoseTeamName">{match.team2?.name}</h5>
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
    console.log(result);
    if (team === 1) setCurrentScore({ team1: result, team2: currentScore.team2 });
    else setCurrentScore({ team1: currentScore.team1, team2: result });
  }

  async function handleSubmitButton() {
    const prognose: Prognose = {
      id: undefined,
      matchID: match.id,
      team1_result: currentScore.team1,
      team2_result: currentScore.team2,
      tournamentID: 1,
      userID: appState.userID,
    };
    if (match.prognoses) prognose.id = match.prognoses[0].id;
    await updatePrognose(prognose);
  }

  async function updatePrognose(prognose: Prognose) {
    const myHeaders = {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + appState.accessToken,
    };
    const body = JSON.stringify(prognose);
    const request = {
      method: 'POST',
      headers: myHeaders,
      body,
    };
    if (prognose.id) request.method = 'PUT';
    prognose.id = undefined;

    try {
      const response = await fetch(
        `${SERVER}/prognoses/?competitionID=${appState.currentCompetitionID}`,
        request
      );
      if (response.status === 401)
        throw Error(`Error creating prognoses ${response.status} ${response.statusText} `);
      const res = await response.json();
      const updatePrognoseWrapper = document.getElementById('updatePrognoseCanvas');
      if (updatePrognoseWrapper) updatePrognoseWrapper.style.display = 'none';
      const resp = fetchData(
        `${SERVER}/matches?competitionID=${appState.currentCompetitionID}`,
        setMatches
      );

      return res;
    } catch (e: any) {
      console.log(e.message);
    }
  }

  function closeWindow() {
    const element = document.getElementById('updatePrognoseCanvas');
    if (element) element.style.display = 'none';
    const body = document.getElementsByTagName('body')[0];
    if (body) body.style.overflow = 'scroll';
  }
};
export default UpdatePrognose;
