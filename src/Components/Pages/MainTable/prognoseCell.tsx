import { useState } from 'react';
import { Match } from '../../../interfaces/interfaces';
import { Dispatch, SetStateAction } from 'react';
import formatDate from '../../../functions/formatDate';
import UpdatePrognose from '../../updatePrognose/UpdatePrognose';

interface MyProps {
  match: Match;
  setChosenMatch: Dispatch<SetStateAction<Match>>;
  setPopUp: Dispatch<SetStateAction<JSX.Element>>;
}
export default function MatchLine(props: MyProps) {
  const [match, setMatch] = useState<Match>(props.match);
  const popUp = <UpdatePrognose match={match} setMatch={setMatch}></UpdatePrognose>;
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
      key={props.match.id}
      className="prognoses__prognose_wrapper"
      onClick={() => {
        handleMatchClick();
      }}
    >
      <div className="prognoses__date">{formatDate(new Date(props.match.starts_at))}</div>
      <div className="prognoses__teams_wrapper">
        <p className="prognoses__team_name">{match.team1?.name}</p>
        <p className="prognoses__team_name">{match.team2?.name}</p>
      </div>
      <div className="prognoses__score">{score}</div>
    </li>
  );
  function handleMatchClick() {
    const body = document.getElementsByTagName('body')[0];
    if (body) body.style.overflow = 'hidden';
    props.setChosenMatch(match);
    props.setPopUp(popUp);
    const updatePrognoseWrapper = document.getElementById('updatePrognoseCanvas');
    if (updatePrognoseWrapper) updatePrognoseWrapper.style.display = 'flex';
  }
}
