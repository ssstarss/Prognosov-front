import { useState } from 'react';
import { Prognose } from '../../../interfaces/interfaces';
import UpdatePrognose from './updatePrognose/UpdatePrognose';
import formatDate from '../../../functions/formatDate';
import { appState } from '../../../constants';
import { createPortal } from 'react-dom';
import ModalWrapper from '../../ModalPortal/modalWrapper';

interface MyProps {
  prognose: Prognose;
}
export default function PrognoseLine(props: MyProps) {
  const [prognose, setPrognose] = useState<Prognose>(props.prognose);
  const [showModal, setShowModal] = useState(false);

  const score = (
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
      onClick={
        editable
          ? () => {
              setShowModal(true);
            }
          : undefined
      }
    >
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
      <div className="prognoses__date">{formatDate(new Date(prognose.game.starts_at))}</div>

      <div className="prognoses__teams_wrapper">
        <p className="prognoses__team_name">{prognose.game.team1?.name}</p>
        <p className="prognoses__team_name">{prognose.game.team2?.name}</p>
      </div>
      <div className="prognoses__score">{score}</div>
    </li>
  );
}
