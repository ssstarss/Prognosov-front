import './prognoses.css';
import { useEffect, useState } from 'react';
import fetchData from '../../../functions/fetchData';
import { appState } from '../../../constants';
import { Match } from '../../../interfaces/interfaces';
import { PopUpCanvas } from '../../PopUpCanvas/popUpCanvas';
import MatchLine from './matchLine';
import { Competition } from '../FillBase/types';

const PrognosesPage = () => {
  const [matches, setMatches] = useState<Match[]>();
  const [competition, setCompetition] = useState<Competition>();
  const [chosenMatch, setChosenMatch] = useState<Match>({
    id: 0,
    starts_at: new Date(),
    competitionID: 0,
    prognoses: [
      {
        id: undefined,
        matchID: -1,
        team1_result: 0,
        team2_result: 0,
        tournamentID: -1,
        userID:-1,
        user: undefined,
      },
    ],
    
  });

  const [popUp, setPopUp] = useState(() => {
    return <></>;
  });

  useEffect(() => {
    fetchData(`/matches?competitionID=${appState.currentCompetitionID}`, setMatches);
    fetchData(`/competitions/${appState.currentCompetitionID}`, setCompetition);
  }, []);
  
  const listPrognoses = matches?.map((match) => {
    return (
      <MatchLine match={match} setChosenMatch={setChosenMatch} setPopUp={setPopUp}></MatchLine>
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
};

export default PrognosesPage;
