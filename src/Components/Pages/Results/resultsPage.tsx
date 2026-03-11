import './results.css';
import { useEffect, useState } from 'react';
import fetchData from '../../../functions/fetchData';
import { appState } from '../../../constants';
import { Game } from '../../../interfaces/interfaces';
import MatchLine from './gameResult';
import { Competition } from '../FillBase/types';
import ChooseOption from '../../chooseOption/chooseOption';

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>();
  const [competition, setCompetition] = useState<Competition>(appState.currentCompetition);
  const [chosenGame, setChosenGame] = useState<Game>({} as Game);

  useEffect(() => {
    fetchData(`/matches/${competition.id}`, setGames);
  }, [competition]);

  appState.currentCompetition = competition;
  localStorage.setItem('currentCompetitionID', competition.id.toString());

  const listGames = games?.map((game) => {
    return <MatchLine game={game} setChosenGame={setChosenGame} key={game.id}></MatchLine>;
  });

  return (
    <div className="pageWrapper">
      <div className="gamesForm">
        <div className="gamesFormHeader">
          <h2 className="gamesPageHeader">Соревнование:</h2>
          <ChooseOption<Competition>
            currentOption={competition}
            setChosenOption={setCompetition}
            host={'/competitions'}
          ></ChooseOption>
        </div>
        <div className="games__list">
          <h4> {listGames}</h4>
        </div>
      </div>
    </div>
  );
}
