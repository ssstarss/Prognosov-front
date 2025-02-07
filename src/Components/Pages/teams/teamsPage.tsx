import './teams.css';
import {useEffect, useState } from 'react';
import fetchData from '../../../functions/fetchData';

type Team = {
  id: number;
  name: string;
  country: string;
  type: string;
};

export default function TeamsPage() {
  let [teams, setTeams] = useState<Team[]>();
  useEffect(() => {
    fetchData('teams',setTeams);
  }, []);

   console.log(teams);
  const listTeams = teams?.map((team) => <li key={team.id}>{team.name} </li>);
  return (
    <div className="teamsPageWrapper">
      <div className="teamsForm">
        <h2 className="loginPageHeader">Teams registered on Server:</h2>

        <h4> {listTeams}</h4>
      </div>
    </div>
  );
}
