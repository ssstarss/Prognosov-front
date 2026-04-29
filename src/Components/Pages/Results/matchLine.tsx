import { useState } from 'react';
import { Game } from '../../../interfaces/interfaces';
import { Dispatch, SetStateAction } from 'react';
import UpdateGame from './updateResult/UpdateResult';
import formatDate, { formatDateString, formatTimeString } from '../../../functions/formatDate';
import { createPortal } from 'react-dom';
import ModalWrapper from '../../ModalPortal/modalWrapper';
import AvatarCircle from '../../common/AvatarCircle';

interface MyProps {
  game: Game;
  setChosenGame: Dispatch<SetStateAction<Game>>;
}
export default function MatchLine(props: MyProps) {
  const [game, setGame] = useState<Game>(props.game);
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      key={props.game.id}
      className="prognoses__prognose_wrapper"
      onClick={() => {
        props.setChosenGame(game);
        setShowModal(true);
      }}
    >
      {showModal &&
        createPortal(
          <ModalWrapper showModal={showModal} setShowModal={setShowModal}>
            <UpdateGame
              game={game}
              updateLineGame={setGame}
              setShowModal={setShowModal}
            ></UpdateGame>
          </ModalWrapper>,
          document.body
        )}
      <div className="prognose__date-wrapper">
        <div className="prognoses__date">{formatDateString(new Date(game.starts_at), true)}</div>
        <div className="prognoses__time">{formatTimeString(new Date(game.starts_at))}</div>
      </div>

      <div className="prognoses__match-wrapper">
        <div className="prognoses__team-wrapper prognoses__team-wrapper--left">
          <div className="prognoses__team-name">{game.team1?.name}</div>
          <div className="prognoses__team-logo">
            <AvatarCircle
              avatar={game.team1?.avatar}
              alt={game.team1?.name ? `${game.team1.name} logo` : 'Team logo'}
              className="prognoses__team-logo-circle"
            />
          </div>
        </div>

        <div className="prognoses__score-block">
          <span className="prognoses__team-score">{game.team1_result ?? '-'}</span>
          <span className="prognoses__separator">:</span>
          <span className="prognoses__team-score">{game.team2_result ?? '-'}</span>
        </div>

        <div className="prognoses__team-wrapper prognoses__team-wrapper--right">
          <div className="prognoses__team-logo">
            <AvatarCircle
              avatar={game.team2?.avatar}
              alt={game.team2?.name ? `${game.team2.name} logo` : 'Team logo'}
              className="prognoses__team-logo-circle"
            />
          </div>
          <div className="prognoses__team-name">{game.team2?.name}</div>
        </div>
      </div>
    </div>
  );
}
