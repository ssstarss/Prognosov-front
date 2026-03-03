import './competitions.css';
import { useEffect, useState } from 'react';
import fetchData from '../../../functions/fetchData';
import { appState } from '../../../constants';
import EditCompetitionForm from './editCompetitionForm';
import { Competition } from '../FillBase/types';

function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>();
  const [currentCompetition, setCurrentCompetition] = useState<Competition>(
    appState.currentCompetition
  );

  useEffect(() => {
    fetchData(`/competitions`, setCompetitions);
  }, []);

  const listCompetitions = competitions?.map((competition) => {
    return (
      <li
        className={`competitionLine ${currentCompetition.id === competition.id ? 'currentCompetition' : ''}`}
        key={competition.id}
      >
        <div className="iconsBlock">
          <div
            className="editIcon"
            onClick={() => {
              editCompetition(competition);
            }}
          >
            E
          </div>
          <div className="deleteIcon">D</div>
        </div>
        <h4 className="competitionName" onClick={() => handleCompetitionClick(competition.id)}>
          {competition.name}{' '}
        </h4>
      </li>
    );
  });
  return (
    <div className="pageWrapper">
      <div className="competitionsForm" id="competitionsForm">
        <EditCompetitionForm competition={currentCompetition} />
        <h2 className="competitionsPageHeader">COMPETITIONS:</h2>
        <div className="competitionList"> {listCompetitions}</div>
        <button className="addButton" onClick={() => {}}>
          ADD
        </button>
      </div>
    </div>
  );

  function editCompetition(competition: Competition) {
    
    setCurrentCompetition(competition);
    const competitionsForm = document.getElementById('competitionsForm');
    
    //if (competitionsForm) competitionsForm.style.visibility = 'hidden';
    const body = document.getElementsByTagName('body')[0];
    const element = document.getElementById('editCompetitionForm');
    
    if (element) element.style.display = 'flex';
    if (body) body.style.overflow = 'hidden';
  }

  function handleCompetitionClick(competitionID: number) {
    localStorage.setItem('currentCompetitionID', competitionID.toString());
    appState.currentCompetitionID = competitionID;
    const competition = competitions?.find(
      (competition) => competition.id === appState.currentCompetitionID
    );
    if (competition) setCurrentCompetition(competition);
  }
}

export default CompetitionsPage;
