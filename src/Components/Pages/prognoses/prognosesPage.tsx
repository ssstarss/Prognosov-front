import './prognoses.css';
import React, { useEffect, useState } from 'react';
import fetchData from '../../../functions/fetchData';
import UpdatePrognose from '../../updatePrognose/updatePrognose';
import { appState, SERVER } from '../../../constants';
import formatDate from '../../../functions/formatDate';
import { Match } from '../../../interfaces/interfaces';

const PrognosesPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>();
  const [chosenMatch, setChosenMatch] = useState<Match>({
    id: 0,
    starts_at: new Date(),
    competitionID: 0,
    prognoses: [
      {
        id: undefined,
        matchID: -1,
        team1_result: 0,
        team2_result: 0,
        tournamentID: -1,
        userID: -1,
      },
    ],
  });

  useEffect(() => {
    fetchData(`${SERVER}/matches?competitionID=${appState.currentCompetitionID}`, setMatches);
  }, []);

  const listPrognoses = matches?.map((match) => {
    let score = (
      <>
        <p className="prognoses__score">__</p>
        <p className="prognoses__score">__</p>
      </>
    );

    if (match.prognoses && match.prognoses.length > 0) {
      score = (
        <div className="prognoses__score_wrapper">
          <p className="prognoses__score">{match.prognoses[0].team1_result}</p>
          <p className="prognoses__score">{match.prognoses[0].team2_result}</p>
        </div>
      );
    }
    return (
      <li
        key={match.id}
        className="prognoses__prognose_wrapper"
        onClick={() => {
          handleMatchClick(match);
        }}
      >
        <div className="prognoses__date">{formatDate(new Date(match.starts_at))}</div>
        <div className="prognoses__teams_wrapper">
          <p className="prognoses__team_name">{match.team1?.name}</p>
          <p className="prognoses__team_name">{match.team2?.name}</p>
        </div>
        <div className="prognoses__score">{score}</div>
      </li>
    );
  });
  return (
    <div className="prognosesPageWrapper">
      <UpdatePrognose
        {...{
          match: chosenMatch as Match,
          setMatches,
        }}
      ></UpdatePrognose>

      <div className="prognosesForm">
        <h2 className="prognosesPageHeader">Prognoses registered on Server:</h2>
        <div className="prognoses__list">
          <h4> {listPrognoses}</h4>
        </div>
      </div>
    </div>
  );
  function handleMatchClick(match: Match) {
    const body = document.getElementsByTagName('body')[0];
    if (body) body.style.overflow = 'hidden';
    setChosenMatch(match);
    const updatePrognoseWrapper = document.getElementById('updatePrognoseCanvas');
    if (updatePrognoseWrapper) updatePrognoseWrapper.style.display = 'flex';
  }
};

export default PrognosesPage;
