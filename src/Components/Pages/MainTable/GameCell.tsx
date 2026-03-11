import React, { useCallback, useState } from 'react';
import { Prognose } from '../../../interfaces/interfaces';
import { Dispatch, SetStateAction } from 'react';
import UpdatePrognose from '../prognoses/updatePrognose/UpdatePrognose';
import { appState } from '../../../constants';
import { createPortal } from 'react-dom';
import ModalWrapper from '../../ModalPortal/modalWrapper';

interface MyProps {
  prognose: Prognose;
}
function GameCell(props: MyProps) {
  const { prognose } = props;
  const [showModal, setShowModal] = useState(false);
  const [chosenPrognose, setChosenPrognose] = useState<Prognose>(prognose);

  let color = 'score_black';
  const result = prognose.result;
  if (result === 2) color = 'score_blue';
  if (result === 3) color = 'score_green';
  if (result === 4) color = 'score_aqua';
  if (result === 5) color = 'score_orange';
  const nowMs = Date.now();
  const deadlineMs = nowMs + appState.deadlineMinutes * 60 * 1000; // сейчас + 15 минут (в UTC)
  const gameStartMs = new Date(props.prognose.game.starts_at).getTime();
  const editable = gameStartMs > deadlineMs;
  return (
    <td
      className="playerResultCell"
      key={prognose.id}
      onClick={
        editable
          ? () => {
              setChosenPrognose(prognose);
              setShowModal(true);
            }
          : undefined
      }
    >
      {showModal &&
        createPortal(
          <ModalWrapper showModal={showModal} setShowModal={setShowModal}>
            <UpdatePrognose
              prognose={chosenPrognose}
              updateCellPrognose={setChosenPrognose}
              setShowModal={setShowModal}
            ></UpdatePrognose>
          </ModalWrapper>,
          document.body
        )}
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
}
export default GameCell;
