import { useEffect, useState } from 'react';
import { Prognose } from '../../../interfaces/interfaces';

import UpdatePrognose from '../prognoses/updatePrognose/UpdatePrognose';
import { appState } from '../../../constants';
import {
  isGameBeforePrognoseDeadline
} from '../../../functions/prognoseEditPolicy';
import { getPrognoseScoreCircleClass } from '../../../functions/prognoseScoreCircleClass';
import editIcon from '../../../assets/edit.png';
import { createPortal } from 'react-dom';
import ModalWrapper from '../../ModalPortal/modalWrapper';

interface MyProps {
  prognose: Prognose;
  onPrognoseSaved?: (
    p: Prognose,
    extras?: { result?: number; resultCup?: number }
  ) => void;
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
  const isHidden = shownPrognose.exists === true && shownPrognose.visible === false;
  const color = isHidden ? '' : getPrognoseScoreCircleClass(shownPrognose);
  const isOwn = appState.userID === shownPrognose.userOnTournamentUserID;
  const editable =
    !isHidden && isGameBeforePrognoseDeadline(shownPrognose.game.starts_at) && isOwn;
  return (
    <td
      className={`playerResultCell ${columnClassName} ${editable ? 'playerResultCell--editable' : 'playerResultCell--readonly'} ${isHidden ? 'playerResultCell--hidden' : ''}`.trim()}
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
        <p className={`prognose ${prognose.exists ? 'prognose--bottom-border' : ''}`}>
          { prognose.visible && prognose.exists ? shownPrognose.team1_result + ' - ' + shownPrognose.team2_result : prognose.exists ? "? - ?" : "" }
          
        </p>
        {editable ? (
          <img src={editIcon} alt="" className="scoreEditIcon" />
        ) : isHidden && prognose.exists ? (
          <div className="score score--hidden" title="Прогноз скрыт до начала матча">
            ?
          </div>
        ) : (
          <div className={`score ${color}`}>
            {typeof shownPrognose.result === 'number' ? shownPrognose.result : prognose.exists ? "?" : "" }
          </div>
        )}
      </div>
    </td>
  );
}
export default GameCell;
