import { appState } from '../constants';

export default function initStartValues() {
  const competitionID = localStorage.getItem('currentCompetitionID');
  if (competitionID) appState.currentCompetitionID = Number(competitionID);
  const tournamentID = localStorage.getItem('currentTournamentID');
  if (tournamentID) appState.currentTournamentID = Number(tournamentID);
}
