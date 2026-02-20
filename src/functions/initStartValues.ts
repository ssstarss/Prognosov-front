import { appState } from '../constants';
import fetchData from './fetchData';

export default async function initStartValues() {
  const competitionID = localStorage.getItem('currentCompetitionID');
  if (competitionID) appState.currentCompetitionID = Number(competitionID);
  const currentCompetition = await fetchData(`/competitions/${appState.currentCompetitionID}`)
  appState.currentCompetition = currentCompetition;
  const usersOnTournament = await fetchData(`/usersOnTournaments/${appState.currentTournamentID}`);
  appState.usersOnTournament = usersOnTournament;
  const tournamentID = localStorage.getItem('currentTournamentID');
  if (tournamentID) appState.currentTournamentID = Number(tournamentID);
  const currentTournament = await fetchData(`/tournaments/${appState.currentTournamentID}`)
  appState.currentTournament = currentTournament;
}