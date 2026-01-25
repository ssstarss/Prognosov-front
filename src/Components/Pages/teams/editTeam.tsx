import './editTeam.css';

import { Team } from '../../../interfaces/interfaces';
import { addData, updateData } from '../../../functions/updateData';
import fetchData from '../../../functions/fetchData';
import { SERVER } from '../../../constants';

export default function EditTeamPage(team: Team, setTeams: Function) {
  return (
    <div className="editTeamPageWrapper" id="editTeamPageWrapper">
      <div className="editTeamBlock">
        <div className="closeCrossWrapper">
          <div className="closeCross" onClick={closeWindow}>
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
            defaultValue={team.name}
          ></input>
        </div>
        <div className="teamCountryInputWrapper">
          <h4>Страна</h4>
          <input
            className="teamCountryInput inputField"
            id="teamCountryInput"
            type="text"
            defaultValue={team.country}
          ></input>
        </div>
        <div className="typeTeamInputWrapper">
          <h4>Тип</h4>
          <select className="typeTeamInput inputField" id="typeTeamInput" defaultValue={team.type}>
            <option value="Club">Club</option>
            <option value="National">National</option>
          </select>
        </div>
        <button className="submitFormButton" onClick={submit}>
          SUBMIT
        </button>
      </div>
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
      id: team.id,
      name: name,
      country: country,
      type: type,
    };

    if (team.id === 0) {
      delete newTeam.id;
      addData(`${SERVER}/teams`, newTeam).then((result: any) => {
        if (result === 200) {
          fetchData(`${SERVER}/teams`, setTeams).then(() => {
            closeWindow();
          });
        }
      });
    } else
      await updateData(`${SERVER}/teams`, newTeam).then((result) => {
        if (result === 200) {
          setTeams((teams: Team[]) => {
            let updatedteams = [...teams].map((item) => {
              if (item.id === team.id) return newTeam;
              return item;
            });
            return updatedteams;
          });
          closeWindow();
        }
      });
  }
  function closeWindow() {
    const element = document.getElementById('editTeamPageWrapper');
    if (element) element.style.visibility = 'hidden';
    const body = document.getElementsByTagName('body')[0];
    if (body) body.style.overflow = 'scroll';
  }
}
