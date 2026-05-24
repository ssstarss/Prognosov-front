import './prognoses.css';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import fetchData from '../../../functions/fetchData';import { fetchGamesWithTeams } from '../../../functions/fetchCompetitionGames';
import { appState } from '../../../constants';
import { Game, Prognose } from '../../../interfaces/interfaces';
import MatchLine from './gameLine';
import { useTournamentContext } from '../../../context/TournamentContext';
import MatchListPageLayout from '../../common/MatchListPageLayout';
import { isGamePrognoseEditable } from '../../../functions/prognoseEditPolicy';

export default function PrognosesPage() {
  const { currentTournament: tournament } = useTournamentContext();
  const [prognoses, setPrognoses] = useState<Prognose[]>();
  const [games, setGames] = useState<Game[]>();
  const listRef = useRef<HTMLUListElement>(null);
  const didScrollRef = useRef(false);

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

// скролл к первому редактируемому прогнозу

  useEffect(() => {
    didScrollRef.current = false;
  }, [tournament?.id]);

  useLayoutEffect(() => {
    if (!games?.length || didScrollRef.current) return;

    const scrollToAnchor = (): boolean => {
      const list = listRef.current;
      const anchor = list?.querySelector('#firstEditable');
      if (!list || !anchor) return false;

      const top =
        anchor.getBoundingClientRect().top -
        list.getBoundingClientRect().top +
        list.scrollTop -
        12;
      list.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      didScrollRef.current = true;
      return true;
    };

    if (scrollToAnchor()) return;

    const timeoutId = window.setTimeout(scrollToAnchor, 50);
    return () => clearTimeout(timeoutId);
  }, [games, tournament?.id]);

  appState.currentTournament = tournament;
  if (tournament?.id) localStorage.setItem('currentTournamentID', tournament.id.toString());  let firstEditable = false;
  let firstEditableFound =false 
  const listPrognoses = games?.map((game) => {
    if (!firstEditableFound) {
      firstEditable = isGamePrognoseEditable(game.starts_at);
      if (firstEditable) firstEditableFound = true;     
    } else firstEditable = false;
    
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
      return <MatchLine prognose={prognose} key={found.id} firstEditable={firstEditable}></MatchLine>;
    }
    const prognose: Prognose = {
      ...emtyPrognose,
      game: game,
    };
    return <MatchLine prognose={prognose} key={game.id} firstEditable={firstEditable}></MatchLine>;
  });

  return (
    <div className="pageWrapper pageWrapper--matchList">
      <MatchListPageLayout title="Мои прогнозы:" listRef={listRef}>
        {listPrognoses}
      </MatchListPageLayout>
    </div>
  );
}
