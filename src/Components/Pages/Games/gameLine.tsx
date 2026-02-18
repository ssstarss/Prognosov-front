import { useState } from 'react';
import { Game } from '../../../interfaces/interfaces';
import { Dispatch, SetStateAction } from 'react';
import UpdateGame from './updateGame/UpdateGame';
import formatDate from '../../../functions/formatDate';

interface MyProps {
  game: Game;
  setChosenGame: Dispatch<SetStateAction<Game>>;
  setPopUp: Dispatch<SetStateAction<JSX.Element>>;
}
export default function GameLine(props: MyProps) {
  const [game, setGame] = useState<Game>(props.game);
  function updateGame(game: Game) {
    setGame(game);
  }
  const popUp = (
    <UpdateGame game={game} updateLineGame={updateGame}></UpdateGame>
  );
  let score = (
    <>
      <p className="games__score">__</p>
      <p className="games__score">__</p>
    </>
  );

  score = (
    <div className="games__score_wrapper">
      <p className="games__score">{game.team1_result}</p>
      <p className="games__score">{game.team2_result}</p>
    </div>
  );

  return (
    <li
      key={props.game.id}
      className="games__game_wrapper"
      onClick={() => {
        handleGameClick();
      }}
    >
      <div className="games__date">{formatDate(new Date(game.starts_at))}</div>
      
      <div className="games__teams_wrapper">
        <p className="games__team_name">{game.team1?.name}</p>
        <p className="games__team_name">{game.team2?.name}</p>
      </div>
      <div className="games__score">{score}</div>
    </li>
  );

  function handleGameClick() {
    const body = document.getElementsByTagName('body')[0];
    if (body) body.style.overflow = 'hidden';
    props.setChosenGame(game);
    props.setPopUp(popUp);
    const updateGameWrapper = document.getElementById('updateGameCanvas');
    if (updateGameWrapper) updateGameWrapper.style.display = 'flex';
  }
}
