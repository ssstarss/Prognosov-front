import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { Tournament } from '../interfaces/types';
import fetchData from '../functions/fetchData';
import { appState } from '../constants';

interface TournamentContextValue {
  currentTournament: Tournament;
  setCurrentTournament: Dispatch<SetStateAction<Tournament>>;
  tournaments: Tournament[];
}

const TournamentContext = createContext<TournamentContextValue | null>(null);

export function TournamentProvider({ children }: { children: React.ReactNode }) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [currentTournament, setCurrentTournament] = useState<Tournament>(
    appState.currentTournament
  );

  const loadTournaments = () => {
    fetchData('/tournaments', (data: Tournament[]) => {
      const list = Array.isArray(data) ? data : [];
      setTournaments(list);
    });
  };

  useEffect(() => {
    if (appState.accessToken) loadTournaments();

    const onAuthRefreshed = () => {
      loadTournaments();
    };

    window.addEventListener('auth-refreshed', onAuthRefreshed);
    return () => window.removeEventListener('auth-refreshed', onAuthRefreshed);
  }, []);

  useEffect(() => {
    if (!tournaments.length) return;

    const storedId = Number(
      localStorage.getItem('currentTournamentID') || appState.currentTournamentID || 0
    );
    const fallback = tournaments[0];
    const selectedId = currentTournament?.id || storedId;
    const found = tournaments.find((t) => t.id === selectedId) ?? fallback;

    if (found && found.id !== currentTournament?.id) {
      setCurrentTournament(found);
    }
  }, [tournaments, currentTournament?.id]);

  useEffect(() => {
    if (!currentTournament?.id) return;
    appState.currentTournament = currentTournament;
    appState.currentTournamentID = currentTournament.id;
    localStorage.setItem('currentTournamentID', String(currentTournament.id));
  }, [currentTournament]);

  const value = useMemo(
    () => ({
      currentTournament,
      setCurrentTournament,
      tournaments,
    }),
    [currentTournament, tournaments]
  );

  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>;
}

export function useTournamentContext() {
  const value = useContext(TournamentContext);
  if (!value) throw new Error('useTournamentContext must be used within TournamentProvider');
  return value;
}
