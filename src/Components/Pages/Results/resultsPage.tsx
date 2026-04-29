import './results.css';
import { useEffect, useState } from 'react';
import fetchData from '../../../functions/fetchData';
import { appState } from '../../../constants';
import { Game } from '../../../interfaces/interfaces';
import { Competition } from '../FillBase/types';
import ChooseOption from '../../chooseOption/chooseOption';

import MatchLine from './matchLine';
import { createPortal } from 'react-dom';
import ModalWrapper from '../../ModalPortal/modalWrapper';
import NewGame from './newGame/newGame';

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [competition, setCompetition] = useState<Competition>(appState.currentCompetition);
  const [chosenGame, setChosenGame] = useState<Game>({} as Game);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    fetchData(`/competitions`, setCompetitions);
  }, []);

  useEffect(() => {
    if (competition?.id) return;
    if (competitions?.length) setCompetition(competitions[0]);
  }, [competitions, competition?.id]);

  useEffect(() => {
    if (!competition?.id) return;
    fetchData(`/matches/${competition.id}`, setGames);
  }, [competition?.id]);

  if (competition?.id) {
    appState.currentCompetition = competition;
    localStorage.setItem('currentCompetitionID', String(competition.id));
  }

  const listGames = games?.map((game) => {
    return <MatchLine game={game} setChosenGame={setChosenGame} key={game.id}></MatchLine>;
  });

  return (
    <div className="pageWrapper">
      {showModal &&
        createPortal(
          <ModalWrapper showModal={showModal} setShowModal={setShowModal}>
            <NewGame
              setShowModal={setShowModal}
              setGames={setGames}
              competition={competition}
            ></NewGame>
          </ModalWrapper>,
          document.body
        )}
      <div className="prognosesForm">
        <div className="formHeaderWrapper">
          <h2 className="formHeader">GAMES:</h2>
        </div>
        <div className="horisontalWrapper">
          <ChooseOption<Competition>
            currentOption={competition}
            setChosenOption={setCompetition}
            options={competitions as Competition[]}
          ></ChooseOption>
          <button
            className="submitFormButton shortButton"
            onClick={() => {
              setShowModal(true);
            }}
          >
            ADD GAME
          </button>
        </div>

        <div className="games__list">
          <div className="games__list_wrapper"> {listGames}</div>
        </div>
      </div>
    </div>
  );
}
