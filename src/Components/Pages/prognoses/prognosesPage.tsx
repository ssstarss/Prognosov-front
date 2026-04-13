import './prognoses.css';
import { useEffect, useState } from 'react';
import fetchData from '../../../functions/fetchData';
import { appState } from '../../../constants';
import { Prognose } from '../../../interfaces/interfaces';
import { PopUpCanvas } from '../../PopUpCanvas/popUpCanvas';
import MatchLine from './gameLine';
import { Tournament, UserOnTournament } from '../FillBase/types';
import ChooseOption from '../../chooseOption/chooseOption';

export default function PrognosesPage() {
  const [prognoses, setPrognoses] = useState<Prognose[]>();
  const [tournament, setTournament] = useState<Tournament>(appState.currentTournament);
  const [chosenPrognose, setChosenPrognose] = useState<Prognose>({} as Prognose);
  const [popUp, setPopUp] = useState(() => {
    return <></>;
  });
  const [usersOnTournaments, setUsersOnTournametns] = useState<UserOnTournament[]>(
    appState.usersOnTournament
  );
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  useEffect(() => {
    fetchData(`/usersOnTournament/${tournament.id}`, setUsersOnTournametns);
    fetchData(`/prognoses/${tournament.id}`, setPrognoses);
  }, [tournament]);
  appState.currentTournament = tournament;
  localStorage.setItem('currentTournamentID', tournament.id.toString());
  useEffect(() => {
    fetchData(`/tournaments`, setTournaments);
  }, []);

  const listPrognoses = prognoses?.map((prognose) => {
    return <MatchLine prognose={prognose} key={prognose.id}></MatchLine>;
  });

  return (
    <div className="pageWrapper">
      <PopUpCanvas PopUp={popUp}></PopUpCanvas>
      <div className="prognosesForm">
        <h2 className="prognosesPageHeader">Мои прогнозы:</h2>

        <ChooseOption<Tournament>
          currentOption={tournament}
          setChosenOption={setTournament}
          options={tournaments}
        />

        <div className="prognoses__list">
          <h4> {listPrognoses}</h4>
        </div>
      </div>
    </div>
  );
}
