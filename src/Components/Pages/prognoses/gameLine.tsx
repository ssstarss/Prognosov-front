import './gameLine.scss';
import { useState } from 'react';
import { Prognose } from '../../../interfaces/interfaces';
import UpdatePrognose from './updatePrognose/UpdatePrognose';
import { isGamePrognoseEditable } from '../../../functions/prognoseEditPolicy';
import { getPrognoseScoreCircleClass } from '../../../functions/prognoseScoreCircleClass';
import { createPortal } from 'react-dom';
import ModalWrapper from '../../ModalPortal/modalWrapper';
import MatchRowBase from './MatchRowBase';

interface MyProps {
  prognose: Prognose;
}
export default function PrognoseLine(props: MyProps) {
  const [prognose, setPrognose] = useState<Prognose>(props.prognose);
  const [showModal, setShowModal] = useState(false);

  const editable = isGamePrognoseEditable(props.prognose.game.starts_at);
  const color = getPrognoseScoreCircleClass(prognose);
  return (
    <>
      {showModal &&
        createPortal(
          <ModalWrapper showModal={showModal} setShowModal={setShowModal}>
            <UpdatePrognose
              prognose={prognose}
              updateLinePrognose={setPrognose}
              setShowModal={setShowModal}
            ></UpdatePrognose>
          </ModalWrapper>,
          document.body
        )}
      <MatchRowBase
        as="li"
        className={editable ? 'prognoses__prognose_wrapper--editable' : 'prognoses__prognose_wrapper--readonly'}
        startsAt={prognose.game.starts_at}
        team1Name={prognose.game.team1?.name}
        team2Name={prognose.game.team2?.name}
        team1Avatar={prognose.game.team1?.avatar}
        team2Avatar={prognose.game.team2?.avatar}
        team1Score={prognose.team1_result}
        team2Score={prognose.team2_result}
        extraRight={<div className={`prognose__player-score ${color}`}>{prognose.result ?? '-'}</div>}
        onClick={editable ? () => setShowModal(true) : undefined}
      />
    </>
  );
}
