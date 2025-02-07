import './prognoses.css';
import { useEffect, useState } from 'react';
import fetchData from '../../../functions/fetchData';

type Match = {
  id: number;
  team1_id: number;
  team1_result: number;
  team2_id: number;
  team2_result: number;
  starts_at: Date;
  competitionID: number;
  prognoses: Prognose[];
};

type Prognose = {
  id: number;
  team1: string;
  team1_result: number;
  team2: string;
  team2_result: number;
  tournamentID: number;
};

export default function PrognosesPage() {
  let [prognoses, setPrognoses] = useState<Prognose[]>();
  useEffect(() => {
    fetchData('prognoses', setPrognoses);
  }, []);
  console.log(prognoses);
  const listPrognoses = prognoses?.map((prognose) => (
    <li key={prognose.id}>
      {prognose.team1} - {prognose.team2} {prognose.team1_result} :{prognose.team2_result}
    </li>
  ));
  return (
    <div className="prognosesPageWrapper">
      <div className="prognosesForm">
        <h2 className="prognosesPageHeader">Prognoses registered on Server:</h2>

        <h4> {listPrognoses}</h4>
      </div>
    </div>
  );
}
