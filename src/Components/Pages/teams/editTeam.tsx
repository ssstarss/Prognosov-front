import './editTeam.css';

import { Team } from '../../../interfaces/interfaces';
import { addData, updateData } from '../../../functions/updateData';
import fetchData from '../../../functions/fetchData';
import { SERVER } from '../../../constants';

export default function EditTeamPage(props: { team: Team, setTeams: Function, setShowModal: Function }) {
  return (
    <div
      className="editTeamPageWrapper"
      id="editTeamPageWrapper"
      onClick={(e) => e.stopPropagation()}
    >
      
        <div className="closeCrossWrapper">
          <div className="closeCross" onClick={() => props.setShowModal(false)}>
            X
          </div>
        </div>
        <h3 className="popUpHeader">Введите данные команды</h3>
        <div className="teamNameInputWrapper">
          <h4>Название</h4>
          <input
            className="teamNameInput inputField"
            id="teamNameInput"
            type="text"
            defaultValue={props.team.name}
          ></input>
        </div>
        <div className="teamCountryInputWrapper">
          <h4>Страна</h4>
          <input
            className="teamCountryInput inputField"
            id="teamCountryInput"
            type="text"
            defaultValue={props.team.country}
          ></input>
        </div>
        <div className="typeTeamInputWrapper">
          <h4>Тип</h4>
          <select className="typeTeamInput inputField" id="typeTeamInput" defaultValue={props.team.type}>
            <option value="Club">Club</option>
            <option value="National">National</option>
          </select>
        </div>
        <button className="submitFormButton" onClick={submit}>
          SUBMIT
        </button>
      </div>
    
  );

  async function submit() {
    const nameElement = document.getElementById('teamNameInput');
    const name = (nameElement as HTMLInputElement).value;
    const countryElement = document.getElementById('teamCountryInput');
    const country = (countryElement as HTMLInputElement).value;
    const typeElement = document.getElementById('typeTeamInput');
    const type = (typeElement as HTMLInputElement).value;
    const newTeam = {
      id: props.team.id,
      name: name,
      country: country,
      type: type,
    };

    if (props.team.id === 0) {
      delete newTeam.id;
      addData(`/teams`, newTeam).then((result: any) => {
        if (result === 200) {
          fetchData(`/teams`, props.setTeams).then(() => {
            props.setShowModal(false);
          });
        }
      });
    } else
      await updateData(`/teams`, newTeam).then((result) => {
        if (result === 200) {
          props.setTeams((teams: Team[]) => {
            let updatedteams = [...teams].map((item) => {
              if (item.id === props.team.id) return newTeam;
              return item;
            });
            return updatedteams;
          });
          props.setShowModal(false);
        }
      });
  }
}
