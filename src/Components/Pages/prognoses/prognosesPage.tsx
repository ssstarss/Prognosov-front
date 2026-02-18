import './prognoses.css';
import { useEffect, useState } from 'react';
import fetchData from '../../../functions/fetchData';
import { appState } from '../../../constants';
import { Prognose } from '../../../interfaces/interfaces';
import { PopUpCanvas } from '../../PopUpCanvas/popUpCanvas';
import MatchLine from './gameLine';
import { Competition } from '../FillBase/types';

export default function PrognosesPage() {
  const [prognoses, setPrognoses] = useState<Prognose[]>();
  const [competition, setCompetition] = useState<Competition>();
  const [chosenPrognose, setChosenPrognose] = useState<Prognose>({} as Prognose);
  const [popUp, setPopUp] = useState(() => {
    return <></>;
  });

  useEffect(() => {
    fetchData(`/prognoses/${appState.currentTournamentID}`, setPrognoses);
    fetchData(`/competitions/${appState.currentCompetitionID}`, setCompetition);
  }, []);

  const listPrognoses = prognoses?.map((prognose) => {
    return (
      <MatchLine
        prognose={prognose}
        setChosenPrognose={setChosenPrognose}
        setPopUp={setPopUp}
        key = {prognose.id}
      ></MatchLine>
    );
  });

  return (
    <div className="prognosesPageWrapper">
      <PopUpCanvas PopUp={popUp}></PopUpCanvas>
      <div className="prognosesForm">
        <h2 className="prognosesPageHeader">Мои прогнозы:</h2>
        <h2 className="prognosesPageHeader">{competition?.name}</h2>
        <div className="prognoses__list">
          <h4> {listPrognoses}</h4>
        </div>
      </div>
    </div>
  );
}
