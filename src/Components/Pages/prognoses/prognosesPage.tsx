import './prognoses.css';
import { useEffect, useState } from 'react';
import fetchData from '../../../functions/fetchData';
import { fetchGamesWithTeams } from '../../../functions/fetchCompetitionGames';
import { appState } from '../../../constants';
import { Game, Prognose } from '../../../interfaces/interfaces';
import MatchLine from './gameLine';
import { useTournamentContext } from '../../../context/TournamentContext';
import MatchListPageLayout from '../../common/MatchListPageLayout';

export default function PrognosesPage() {
  const { currentTournament: tournament } = useTournamentContext();
  const [prognoses, setPrognoses] = useState<Prognose[]>();
  const [games, setGames] = useState<Game[]>();
  useEffect(() => {
    if (!tournament?.id || !tournament.competitionID) return;
    fetchData(`/prognoses/${tournament.id}`, setPrognoses);
    let cancelled = false;
    fetchGamesWithTeams(tournament.competitionID).then((loaded) => {
      if (!cancelled) setGames(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [tournament?.id, tournament.competitionID]);
  appState.currentTournament = tournament;
  if (tournament?.id) localStorage.setItem('currentTournamentID', tournament.id.toString());

  const listPrognoses = games?.map((game) => {
    const emtyPrognose: Prognose = {
      id: undefined,
      gameID: game.id,
      game: game,
      team1_result: undefined,
      team2_result: undefined,
      result: undefined,
      userOnTournamentUserID: appState.userID,
      userOnTournamentTournamentID: tournament.id,
    };
    const found = prognoses?.find((prognose) => prognose.gameID === game.id);
    if (found) {
      const prognose: Prognose = {
        ...found,
        game: game,
      };
      return <MatchLine prognose={prognose} key={found.id}></MatchLine>;
    }
    const prognose: Prognose = {
      ...emtyPrognose,
      game: game,
    };
    return <MatchLine prognose={prognose} key={game.id}></MatchLine>;
  });

  return (
    <div className="pageWrapper pageWrapper--matchList">
      <MatchListPageLayout title="Мои прогнозы:">{listPrognoses}</MatchListPageLayout>
    </div>
  );
}
