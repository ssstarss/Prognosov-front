import { useEffect, useState } from 'react';
import { Prognose } from '../../../interfaces/interfaces';

import UpdatePrognose from '../prognoses/updatePrognose/UpdatePrognose';
import { appState } from '../../../constants';
import { isPrognoseDeadlineBypassRole } from '../../../functions/prognoseEditPolicy';
import { createPortal } from 'react-dom';
import ModalWrapper from '../../ModalPortal/modalWrapper';

interface MyProps {
  prognose: Prognose;
  onPrognoseSaved?: (p: Prognose) => void;
  columnClassName?: string;
}
function GameCell(props: MyProps) {
  const { prognose, onPrognoseSaved, columnClassName = '' } = props;
  const [showModal, setShowModal] = useState(false);
  const [chosenPrognose, setChosenPrognose] = useState<Prognose>(prognose);

  useEffect(() => {
    if (!showModal) setChosenPrognose(prognose);
  }, [prognose, showModal]);

  let color = 'score_black';
  const shownPrognose = chosenPrognose;
  const result = shownPrognose.result;
  if (result === 2) color = 'score_blue';
  if (result === 3) color = 'score_green';
  if (result === 4) color = 'score_aqua';
  if (result === 5) color = 'score_orange';
  const nowMs = Date.now();
  const deadlineMs = nowMs + appState.deadlineMinutes * 60 * 1000; // сейчас + 15 минут (в UTC)
  const gameStartMs = new Date(shownPrognose.game.starts_at).getTime();
  const beforeDeadline = gameStartMs > deadlineMs;
  const isOwn = appState.userID === shownPrognose.userOnTournamentUserID;
  const editable =
    isPrognoseDeadlineBypassRole() || (beforeDeadline && isOwn);
  return (
    <td
      className={`playerResultCell ${columnClassName}`.trim()}
      key={shownPrognose.id}
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
              onPrognoseSaved={onPrognoseSaved}
              setShowModal={setShowModal}
            ></UpdatePrognose>
          </ModalWrapper>,
          document.body
        )}
      <div className="playerResultWrapper">
        <p className="prognose">
          {typeof shownPrognose.team1_result === 'number' ? shownPrognose.team1_result : '-'} -{' '}
          {typeof shownPrognose.team2_result === 'number' ? shownPrognose.team2_result : '_'}
        </p>
        <div className={`score ${color}`}>
          {typeof shownPrognose.result === 'number' ? shownPrognose.result : '-'}
        </div>
      </div>
    </td>
  );
}
export default GameCell;
