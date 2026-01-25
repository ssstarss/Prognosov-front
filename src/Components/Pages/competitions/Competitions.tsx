import { useEffect, useState } from 'react';
import './competitions.css';
import fetchData from '../../../functions/fetchData';
import { appState, SERVER } from '../../../constants';
interface Competitions {
  id: number;
  name: String;
  comments: String;
  StartsAt: Date;
  EndsAt: Date;
}

function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competitions[]>();
  let [currentCompetitionName, setCurrentCompetitionName] = useState<String>();

  useEffect(() => {
    fetchData(`${SERVER}/competitions`, setCompetitions);
  }, []);
  const competitionName = competitions?.find(
    (competition) => competition.id === appState.currentCompetitionID
  )?.name;
  console.log('compName', competitionName);
  currentCompetitionName = competitionName;

  const listCompetitions = competitions?.map((competition) => (
    <li key={competition.id} onClick={() => handleCompetitionClick(competition.id)}>
      {competition.name}
    </li>
  ));
  return (
    <div className="competitionsPageWrapper">
      <div className="competitionsForm">
        <h2 className="competitionsPageHeader">COMPETITIONS:</h2>
        <h4 className="competition"> {listCompetitions}</h4>
        <h3 className="currentCompetitionHeader">Active Competition:</h3>
        <h3 className="currentCompetition">{currentCompetitionName}</h3>
      </div>
    </div>
  );
  function handleCompetitionClick(competitionID: number) {
    localStorage.setItem('currentCompetitionID', competitionID.toString());
    appState.currentCompetitionID = competitionID;
    const competitionName = competitions?.find(
      (competition) => competition.id === appState.currentCompetitionID
    )?.name;
    if (competitionName) setCurrentCompetitionName(competitionName);
  }
}

export default CompetitionsPage;
