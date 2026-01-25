import { useEffect, useState } from 'react';
import './tournaments.css';
import fetchData from '../../../functions/fetchData';
import { appState, SERVER } from '../../../constants';
interface Tournament {
  id: number;
  name: string;
  competitionID: number;
  tournamentID: number;
  comments: string;
}

function TournamentsPage() {
  const [tourmaments, setTournaments] = useState<Tournament[]>();
  let [currentTournamentName, setCurrentTournamentName] = useState<String>();

  useEffect(() => {
    
    fetchData(`${SERVER}/tournaments`, setTournaments);
  }, []);
  const tournamentName = tourmaments?.find(
    (tourmament) => tourmament.id === appState.currentTournamentID
  )?.name;

  currentTournamentName = tournamentName;

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
    const tournamentName = tourmaments?.find(
      (tourmament) => tourmament.id === appState.currentTournamentID
    )?.name;
    if (tournamentName) setCurrentTournamentName(tournamentName);
    // const url = new URL(`${SERVER}/competitions?competitionID:${tournament.competitionID}`);
    // const competition = fetchData(url.href);
    // console.log(competition)
  }
}

export default TournamentsPage;
