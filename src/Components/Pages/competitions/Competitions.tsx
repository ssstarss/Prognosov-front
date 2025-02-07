import { commonVars } from '../../../constants';
import { useEffect, useState } from 'react';
import './competitions.css';
import fetchData from '../../../functions/fetchData';
interface Competitions {
  id: number;
  name: String;
  comments: String;
  StartsAt: Date;
  EndsAt: Date;
}

function CompetitionsPage() {
  let [competitions, setCompetitions] = useState<Competitions[]>();
  useEffect(() => {
    fetchData('competitions',setCompetitions);
  }, []);
  const listCompetitions = competitions?.map((competition) => (
    <li key={competition.id}>{competition.name} </li>
  ));
  return (
    <div className="competitionsPageWrapper">
      <div className="competitionsForm">
        <h2 className="competitionsPageHeader">COMPETITIONS registered on Server:</h2>
        <h4> {listCompetitions}</h4>
      </div>
    </div>
  );
}

export default CompetitionsPage;
