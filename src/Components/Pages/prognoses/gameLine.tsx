import { useState } from 'react';
import { Prognose } from '../../../interfaces/interfaces';
import { Dispatch, SetStateAction } from 'react';
import UpdatePrognose from './updatePrognose/UpdatePrognose';
import formatDate from '../../../functions/formatDate';
import { appState } from '../../../constants';

interface MyProps {
  prognose: Prognose;
  setChosenPrognose: Dispatch<SetStateAction<Prognose>>;
  setPopUp: Dispatch<SetStateAction<JSX.Element>>;
}
export default function PrognoseLine(props: MyProps) {
  const [prognose, setPrognose] = useState<Prognose>(props.prognose);
  function updatePrognose(prognose: Prognose) {
    setPrognose(prognose);
  }
  const popUp = (
    <UpdatePrognose prognose={prognose} updateLinePrognose={updatePrognose}></UpdatePrognose>
  );
  let score = (
    <>
      <p className="prognoses__score">__</p>
      <p className="prognoses__score">__</p>
    </>
  );

  score = (
    <div className="prognoses__score_wrapper">
      <p className="prognoses__score">{prognose.team1_result}</p>
      <p className="prognoses__score">{prognose.team2_result}</p>
    </div>
  );
  
  const nowMs = Date.now();
  const deadlineMs = nowMs + appState.deadlineMinutes * 60 * 1000; // сейчас + 15 минут (в UTC)
  const gameStartMs = new Date(props.prognose.game.starts_at).getTime();
  const editable = gameStartMs > deadlineMs;
  
  return (
    <li
      key={props.prognose.id}
      className="prognoses__prognose_wrapper"
      onClick={editable ? () => handlePrognoseClick() : undefined}
    >
      <div className="prognoses__date">{formatDate(new Date(prognose.game.starts_at))}</div>

      <div className="prognoses__teams_wrapper">
        <p className="prognoses__team_name">{prognose.game.team1?.name}</p>
        <p className="prognoses__team_name">{prognose.game.team2?.name}</p>
      </div>
      <div className="prognoses__score">{score}</div>
    </li>
  );

  function handlePrognoseClick() {
    const body = document.getElementsByTagName('body')[0];
    if (body) body.style.overflow = 'hidden';
    props.setChosenPrognose(prognose);
    props.setPopUp(popUp);
    const updatePrognoseWrapper = document.getElementById('updatePrognoseCanvas');
    if (updatePrognoseWrapper) updatePrognoseWrapper.style.display = 'flex';
  }
}
