import './gameLine.scss';
import { useState } from 'react';
import { Prognose } from '../../../interfaces/interfaces';
import UpdatePrognose from './updatePrognose/UpdatePrognose';
import { formatDateString, formatTimeString } from '../../../functions/formatDate';
import { appState } from '../../../constants';
import { isPrognoseDeadlineBypassRole } from '../../../functions/prognoseEditPolicy';
import { createPortal } from 'react-dom';
import ModalWrapper from '../../ModalPortal/modalWrapper';
import AvatarCircle from '../../common/AvatarCircle';

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

  return (
    <li
      key={props.prognose.id}
      className="prognoses__prognose_wrapper"
      /* временно не проверяем можно ли редактировать
      onClick={
        editable
          ? () => {
              setShowModal(true);
            }
          : undefined
      }*/
      onClick={() => {
        setShowModal(true);
      }}
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
      <div className="prognose__date-wrapper">
        <div className="prognoses__date">
          {formatDateString(new Date(prognose.game.starts_at), true)}
        </div>
        <div className="prognoses__time">{formatTimeString(new Date(prognose.game.starts_at))}</div>
      </div>

      <div className="prognoses__match-wrapper">
        <div className="prognoses__team-wrapper prognoses__team-wrapper--left">
          <div className="prognoses__team-name">{prognose.game.team1?.name}</div>
          <div className="prognoses__team-logo">
            <AvatarCircle
              avatar={prognose.game.team1?.avatar}
              alt={prognose.game.team1?.name ? `${prognose.game.team1.name} logo` : 'Team logo'}
              className="prognoses__team-logo-circle"
            />
          </div>
        </div>

        <div className="prognoses__score-block">
          <span className="prognoses__team-score">{prognose.team1_result ?? '-'}</span>
          <span className="prognoses__separator">:</span>
          <span className="prognoses__team-score">{prognose.team2_result ?? '-'}</span>
        </div>

        <div className="prognoses__team-wrapper prognoses__team-wrapper--right">
          <div className="prognoses__team-logo">
            <AvatarCircle
              avatar={prognose.game.team2?.avatar}
              alt={prognose.game.team2?.name ? `${prognose.game.team2.name} logo` : 'Team logo'}
              className="prognoses__team-logo-circle"
            />
          </div>
          <div className="prognoses__team-name">{prognose.game.team2?.name}</div>
        </div>
      </div>
    </li>
  );
}
