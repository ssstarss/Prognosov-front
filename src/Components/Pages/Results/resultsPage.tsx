import './results.css';
import { useEffect, useState } from 'react';
import fetchData from '../../../functions/fetchData';
import { fetchGamesWithTeams } from '../../../functions/fetchCompetitionGames';
import { appState } from '../../../constants';
import { Game } from '../../../interfaces/interfaces';
import { Competition } from '../../../interfaces/types';
import { useTournamentContext } from '../../../context/TournamentContext';

import MatchLine from './matchLine';
import { createPortal } from 'react-dom';
import ModalWrapper from '../../ModalPortal/modalWrapper';
import NewGame from './newGame/newGame';
import MatchListPageLayout from '../../common/MatchListPageLayout';

export default function GamesPage() {
  const { currentTournament } = useTournamentContext();
  const [games, setGames] = useState<Game[]>([]);
  const [competition, setCompetition] = useState<Competition>(appState.currentCompetition);
  const [chosenGame, setChosenGame] = useState<Game>({} as Game);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    fetchData(`/competitions`, setCompetitions);
  }, []);

  useEffect(() => {
    if (!currentTournament?.id) return;
    const fromTournament =
      currentTournament.competition?.id != null
        ? currentTournament.competition
        : competitions.find((c) => c.id === currentTournament.competitionID);
    if (fromTournament?.id) setCompetition(fromTournament);
  }, [currentTournament, competitions]);

  useEffect(() => {
    if (!currentTournament?.competitionID) return;
    let cancelled = false;
    fetchGamesWithTeams(currentTournament.competitionID).then((loaded) => {
      if (!cancelled) setGames(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [currentTournament?.id, currentTournament?.competitionID]);

  if (competition?.id) {
    appState.currentCompetition = competition;
    localStorage.setItem('currentCompetitionID', String(competition.id));
  }

  const listGames = games?.map((game) => {
    return (
      <MatchLine
        game={game}
        setChosenGame={setChosenGame}
        setGames={setGames}
        competition={competition}
        key={game.id}
      ></MatchLine>
    );
  });

  return (
    <div className="pageWrapper pageWrapper--matchList">
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

      <MatchListPageLayout
        title="GAMES:"
        controls={
          <div className="horisontalWrapper">
            {competition?.name ? <span className="selectItem">{competition.name}</span> : null}
            <button
              className="submitFormButton shortButton"
              onClick={() => {
                setShowModal(true);
              }}
            >
              ADD GAME
            </button>
          </div>
        }
      >
        {listGames}
      </MatchListPageLayout>
    </div>
  );
}
