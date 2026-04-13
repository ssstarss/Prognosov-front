import { useState } from 'react';
import { Game } from '../../../interfaces/interfaces';
import { Dispatch, SetStateAction } from 'react';
import UpdateGame from './updateResult/UpdateResult';
import formatDate from '../../../functions/formatDate';
import { createPortal } from 'react-dom';
import ModalWrapper from '../../ModalPortal/modalWrapper';

interface MyProps {
  game: Game;
  setChosenGame: Dispatch<SetStateAction<Game>>;
}
export default function MatchLine(props: MyProps) {
  const [game, setGame] = useState<Game>(props.game);
  const [showModal, setShowModal] = useState(false);

  const score = (
    <div className="games__score_wrapper">
      <p className="games__score">{typeof game.team1_result === 'number' ? game.team1_result : '__'}</p>
      <p className="games__score">{typeof game.team2_result === 'number' ? game.team2_result : '__'}</p>
    </div>
  );

  return (
    <li
      key={props.game.id}
      className="games__game_wrapper"
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
      <div className="games__date">{formatDate(new Date(game.starts_at))}</div>
      <div className="games__teams_wrapper">
        <p className="games__team_name">{game.team1?.name}</p>
        <p className="games__team_name">{game.team2?.name}</p>
      </div>
      <div className="games__score">{score}</div>
    </li>
  );
}
