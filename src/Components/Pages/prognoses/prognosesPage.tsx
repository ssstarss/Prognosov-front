import './prognoses.css';
import { useEffect, useState } from 'react';
import fetchData from '../../../functions/fetchData';
import { appState } from '../../../constants';
import { Prognose } from '../../../interfaces/interfaces';
import MatchLine from './gameLine';
import { useTournamentContext } from '../../../context/TournamentContext';

export default function PrognosesPage() {
  const { currentTournament: tournament } = useTournamentContext();
  const [prognoses, setPrognoses] = useState<Prognose[]>();
  useEffect(() => {
    if (!tournament?.id) return;
    fetchData(`/prognoses/${tournament.id}`, setPrognoses);
  }, [tournament?.id]);
  appState.currentTournament = tournament;
  if (tournament?.id) localStorage.setItem('currentTournamentID', tournament.id.toString());

  const listPrognoses = prognoses?.map((prognose) => {
    return <MatchLine prognose={prognose} key={prognose.id}></MatchLine>;
  });

  return (
    <div className="pageWrapper">
      <div className="prognosesForm">
        <div className="formHeaderWrapper prognosesHeaderWrapper">
          <h2 className="formHeader">Мои прогнозы:</h2>
        </div>

        

        <ul className="prognoses__list">{listPrognoses}</ul>
      </div>
    </div>
  );
}
