import { useEffect, useState } from 'react';
import './tournaments.css';
import fetchData from '../../../functions/fetchData';
import { appState } from '../../../constants';
import { Tournament } from '../FillBase/types';

function TournamentsPage() {
  const [tourmaments, setTournaments] = useState<Tournament[]>();
 const [currentTournament, setCurrentTournament] = useState<Tournament>();
  useEffect(() => {
    fetchData(`/tournaments`, setTournaments);
  }, []);

  const tournament = tourmaments?.find(
    (tournament) => tournament.id === appState.currentTournamentID
  );
  const currentTournamentName = tournament?.name

   const listTournaments = tourmaments?.map((tourmament) => (
    <li key={tourmament.id} onClick={() => handleTournamentClick(tourmament)}>
      {tourmament.name}
    </li>
  ));
  return (
    <div className="tournamentsPageWrapper">
      <div className="tournamentsForm">
        <h2 className="tournamentsPageHeader">TOURNAMENTS:</h2>
        <h4 className="tournament"> {listTournaments}</h4>
        <h3 className="currentTournamentHeader">Active Tournament:</h3>
        <h3 className="currentTournament">{currentTournamentName}</h3>
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
