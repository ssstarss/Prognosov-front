import './games.css';
import { useEffect, useState } from 'react';
import fetchData from '../../../functions/fetchData';
import { appState } from '../../../constants';
import { Game } from '../../../interfaces/interfaces';
import { PopUpCanvas } from '../../PopUpCanvas/popUpCanvas';
import MatchLine from './gameLine';
import { Competition } from '../FillBase/types';

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>();
  const [competition, setCompetition] = useState<Competition>();
  const [chosenGame, setChosenGame] = useState<Game>({} as Game);
  const [popUp, setPopUp] = useState(() => {
    return <></>;
  });

  useEffect(() => {
    fetchData(`/matches/${appState.currentCompetitionID}`, setGames);
    fetchData(`/competitions/${appState.currentCompetitionID}`, setCompetition);
  }, []);

  const listGames = games?.map((game) => {
    return (
      <MatchLine
        game={game}
        setChosenGame={setChosenGame}
        setPopUp={setPopUp}
        key={game.id}
      ></MatchLine>
    );
  });

  return (
    <div className="gamesPageWrapper">
      <PopUpCanvas PopUp={popUp}></PopUpCanvas>
      <div className="gamesForm">
        <h2 className="gamesPageHeader">Мои прогнозы:</h2>
        <h2 className="gamesPageHeader">{competition?.name}</h2>
        <div className="games__list">
          <h4> {listGames}</h4>
        </div>
      </div>
    </div>
  );
}
