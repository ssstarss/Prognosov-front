import './teams.css';
import { useEffect, useState } from 'react';
import fetchData from '../../../functions/fetchData';
import { Team } from '../../../interfaces/interfaces';
import EditTeamPage from './editTeam';
import ConfirmPopUp from '../../ConfirmPopUp/confirmPopup';
import { deleteData } from '../../../functions/updateData';
import { SERVER } from '../../../constants';
import { appState } from '../../../constants';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [team, setTeam] = useState<Team>({
    id: 0,
    name: '',
    country: '',
    type: '',
  });
  useEffect(() => {
    fetchData(`/teams`, setTeams);
  }, []);

  const editTeamsPop = EditTeamPage(team, setTeams);

  const listTeams = teams?.map((team) => (
    <div className="teamRaw" key={team.id}>
      {team.name}
      <div className="teamButtonsWrapper">
        <button
          onClick={() => {
            setTeam(team);
            showPopUp();
          }}
        >
          E
        </button>
        <button
          onClick={() => {
            setTeam(team);
            showDeleteConfirm();
          }}
        >
          D
        </button>
      </div>
    </div>
  ));
  return (
    <div className="pageWrapper">
      {editTeamsPop}
      {ConfirmPopUp(team, deleteData, `'${SERVER}/teams`, setTeams)}
      <div className="teamsListWrapper">
        <div className="selectTeamTypeWrapper">
          <select
            className="selectTeamType"
            onChange={async (event) => {
              let url = new URL(`${SERVER}/teams`);
              url.searchParams.append('type', event.target.value);

              const result = await fetchDataTeam(url.href);

              setTeams(result);
            }}
          >
            <option value="*">ALL</option>
            <option value="Club">Club</option>
            <option value="National">National</option>
          </select>
        </div>
        <h2 className="teamsListHeader">Teams registered on Server:</h2>
        <div className="teamList">
          <div> {listTeams}</div>
        </div>
        <button
          className="submitFormButton"
          onClick={() => {
            const emptyTeam = {
              id: 0,
              name: '',
              country: '',
              type: '',
            };
            setTeam(emptyTeam);
            showPopUp();
          }}
        >
          ADD
        </button>
      </div>
    </div>
  );

  function showPopUp() {
    const element = document.getElementById('editTeamPageWrapper');
    const body = document.getElementsByTagName('body')[0];
    if (element) element.style.visibility = 'visible';
    if (body) body.style.overflow = 'hidden';
  }

  function showDeleteConfirm() {
    const element = document.getElementById('confirmPopUpCanvas');
    const body = document.getElementsByTagName('body')[0];
    if (element) element.style.visibility = 'visible';
    if (body) body.style.overflow = 'hidden';
  }

  async function fetchDataTeam(host: string, setFunc?: Function) {
    const myHeaders = {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + appState.accessToken,
    };
    const request = {
      method: 'GET',
      headers: myHeaders,
    };

    try {
      const response = await fetch(host, request);
      if (response.status === 401)
        throw Error(`Error reading ${host} ${response.status} ${response.statusText} `);

      const res = await response.json();
      if (setFunc) setFunc(res);
      else return res;
    } catch (e: any) {
      console.log(e.message);
    }
  }
}
