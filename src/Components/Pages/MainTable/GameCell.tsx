import React, { useCallback } from 'react';
import { Prognose } from '../../../interfaces/interfaces';
import { Dispatch, SetStateAction } from 'react';
import UpdatePrognose from '../prognoses/updatePrognose/UpdatePrognose';
import { appState } from '../../../constants';

interface MyProps {
  prognose: Prognose;
  setChosenPrognose: Dispatch<SetStateAction<Prognose>>;
  setPopUp: Dispatch<SetStateAction<JSX.Element>>;
  onPrognoseUpdate?: (prognose: Prognose) => void;
}
function GameCell(props: MyProps) {
  const { prognose } = props;
  const updatePrognose = useCallback(
    (updatedPrognose: Prognose) => {
      props.onPrognoseUpdate?.(updatedPrognose);
    },
    [props.onPrognoseUpdate]
  );
  const popUp = (
    <UpdatePrognose prognose={prognose} updateCellPrognose={updatePrognose}></UpdatePrognose>
  );
  let color = 'score_black';
  const result = prognose.result;
  if (result === 2) color = 'score_blue';
  if (result === 3) color = 'score_green';
  if (result === 4) color = 'score_aqua';
  if (result === 5) color = 'score_orange';
  let onCLick = () => {};
  const nowMs = Date.now();
  const deadlineMs = nowMs + appState.deadlineMinutes * 60 * 1000; // сейчас + 15 минут (в UTC)
  const gameStartMs = new Date(props.prognose.game.starts_at).getTime();
  const editable = gameStartMs > deadlineMs;
  if (prognose.userOnTournamentUserID === appState.userID && editable) onCLick = handleGameClick;
  return (
    <td className="playerResultCell" key={prognose.id} onClick={onCLick}>
      <div className="playerResultWrapper">
        <p className="prognose">
          {typeof prognose.team1_result === 'number' ? prognose.team1_result : '-'} -{' '}
          {typeof prognose.team2_result === 'number' ? prognose.team2_result : '_'}
        </p>
        <div className={`score ${color}`}>
          {typeof prognose.result === 'number' ? prognose.result : '-'}
        </div>
      </div>
    </td>
  );

  function handleGameClick() {
    const body = document.getElementsByTagName('body')[0];
    if (body) body.style.overflow = 'hidden';
    props.setChosenPrognose(prognose);
    props.setPopUp(popUp);
    const updatePrognoseWrapper = document.getElementById('updatePrognoseCanvas');
    if (updatePrognoseWrapper) updatePrognoseWrapper.style.display = 'flex';
  }
}
export default React.memo(GameCell);
