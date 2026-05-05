import './gameLine.scss';
import { useState } from 'react';
import { Prognose } from '../../../interfaces/interfaces';
import UpdatePrognose from './updatePrognose/UpdatePrognose';
import { appState } from '../../../constants';
import { isPrognoseDeadlineBypassRole } from '../../../functions/prognoseEditPolicy';
import { createPortal } from 'react-dom';
import ModalWrapper from '../../ModalPortal/modalWrapper';
import MatchRowBase from './MatchRowBase';

interface MyProps {
  prognose: Prognose;
}
export default function PrognoseLine(props: MyProps) {
  const [prognose, setPrognose] = useState<Prognose>(props.prognose);
  const [showModal, setShowModal] = useState(false);

  const nowMs = Date.now();
  const deadlineMs = nowMs + appState.deadlineMinutes * 60 * 1000; // сейчас + 15 минут (в UTC)
  const gameStartMs = new Date(props.prognose.game.starts_at).getTime();
  const editable = isPrognoseDeadlineBypassRole() || gameStartMs > deadlineMs;
  let color = 'score_black';
  if (prognose.result === 2) color = 'score_blue';
  if (prognose.result === 3) color = 'score_green';
  if (prognose.result === 4) color = 'score_aqua';
  if (prognose.result === 5) color = 'score_orange';
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
        startsAt={prognose.game.starts_at}
        team1Name={prognose.game.team1?.name}
        team2Name={prognose.game.team2?.name}
        team1Avatar={prognose.game.team1?.avatar}
        team2Avatar={prognose.game.team2?.avatar}
        team1Score={prognose.team1_result}
        team2Score={prognose.team2_result}
        extraRight={<div className={`prognose__player-score ${color}`}>{prognose.result ?? '-'}</div>}
        onClick={() => {
          setShowModal(true);
        }}
      />
    </>
  );
}
