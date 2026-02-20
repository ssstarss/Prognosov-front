import { useEffect, useState } from 'react';
import './tournaments.css';
import fetchData from '../../../functions/fetchData';
import { appState } from '../../../constants';
import { Tournament } from '../FillBase/types';
import ChooseOption from '../../chooseOption/chooseOption';

function TournamentsPage() {
  const [tourmaments, setTournaments] = useState<Tournament[]>({} as Tournament[]);
  const [currentTournament, setCurrentTournament] = useState<Tournament>(
    appState.currentTournament
  );

  return (
    <div className="tournamentsPageWrapper">
      <div className="tournamentsForm">
        <h3 className="currentTournamentHeader">Active Tournament:</h3>
        <ChooseOption<Tournament>
          currentOption={currentTournament}
          setChosenOption={setCurrentTournament}
          host={'/tournaments'}
        ></ChooseOption>
      </div>
    </div>
  );
  function handleTournamentClick(tournament: Tournament) {
    console.log(tournament);
    localStorage.setItem('currentTournamentID', tournament.id.toString());
    appState.currentTournamentID = tournament.id;
    setCurrentTournament(tournament);
  }
}

export default TournamentsPage;
