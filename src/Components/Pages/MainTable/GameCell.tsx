import { useEffect, useState } from 'react';
import { Prognose } from '../../../interfaces/interfaces';

import UpdatePrognose from '../prognoses/updatePrognose/UpdatePrognose';
import { appState } from '../../../constants';
import {
  isGameBeforePrognoseDeadline,
  isPrognoseDeadlineBypassRole,
} from '../../../functions/prognoseEditPolicy';
import { getPrognoseScoreCircleClass } from '../../../functions/prognoseScoreCircleClass';
import editIcon from '../../../assets/edit.png';
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

  const shownPrognose = chosenPrognose;
  const color = getPrognoseScoreCircleClass(shownPrognose);
  const isOwn = appState.userID === shownPrognose.userOnTournamentUserID;
  const editable =
    isPrognoseDeadlineBypassRole() ||
    (isGameBeforePrognoseDeadline(shownPrognose.game.starts_at) && isOwn);
  return (
    <td
      className={`playerResultCell ${columnClassName} ${editable ? 'playerResultCell--editable' : 'playerResultCell--readonly'}`.trim()}
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
          {typeof shownPrognose.team2_result === 'number' ? shownPrognose.team2_result : '-'}
        </p>
        {editable ? (
          <img src={editIcon} alt="" className="scoreEditIcon" />
        ) : (
          <div className={`score ${color}`}>
            {typeof shownPrognose.result === 'number' ? shownPrognose.result : '-'}
          </div>
        )}
      </div>
    </td>
  );
}
export default GameCell;
