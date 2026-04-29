import { appState } from '../constants';
import fetchData from './fetchData';

export default async function initStartValues() {
  const competitionID = localStorage.getItem('currentCompetitionID');
  if (competitionID) appState.currentCompetitionID = Number(competitionID);
  const tournamentID = localStorage.getItem('currentTournamentID');
  if (tournamentID) appState.currentTournamentID = Number(tournamentID);

  appState.currentCompetition = {} as typeof appState.currentCompetition;
  appState.usersOnTournament = [];
  const currentTournament = await fetchData(`/tournaments/${appState.currentTournamentID}`)
  appState.currentTournament = currentTournament;
}