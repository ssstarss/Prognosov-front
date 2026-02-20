import './prognoses.css';
import { useEffect, useState } from 'react';
import fetchData from '../../../functions/fetchData';
import { appState } from '../../../constants';
import { Prognose } from '../../../interfaces/interfaces';
import { PopUpCanvas } from '../../PopUpCanvas/popUpCanvas';
import MatchLine from './gameLine';
import { Tournament } from '../FillBase/types';
import ChooseOption from '../../chooseOption/chooseOption';

export default function PrognosesPage() {
  const [prognoses, setPrognoses] = useState<Prognose[]>();
  const [tournament, setTournament] = useState<Tournament>(appState.currentTournament);
  const [chosenPrognose, setChosenPrognose] = useState<Prognose>({} as Prognose);
  const [popUp, setPopUp] = useState(() => {
    return <></>;
  });

  useEffect(() => {
    fetchData(`/prognoses/${tournament.id}`, setPrognoses);
  }, [tournament]);
  appState.currentTournament = tournament;
  localStorage.setItem('currentTournamentID', tournament.id.toString());

  const listPrognoses = prognoses?.map((prognose) => {
    return (
      <MatchLine
        prognose={prognose}
        setChosenPrognose={setChosenPrognose}
        setPopUp={setPopUp}
        key={prognose.id}
      ></MatchLine>
    );
  });

  return (
    <div className="prognosesPageWrapper">
      <PopUpCanvas PopUp={popUp}></PopUpCanvas>
      <div className="prognosesForm">
        <h2 className="prognosesPageHeader">Мои прогнозы:</h2>
        <ChooseOption<Tournament>
          currentOption={tournament}
          setChosenOption={setTournament}
          host="/tournaments"
        />
        <div className="prognoses__list">
          <h4> {listPrognoses}</h4>
        </div>
      </div>
    </div>
  );
}
