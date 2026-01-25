import { Team } from '../../interfaces/interfaces';
import './confirmPopUp.css';

export default function ConfirmPopUp(
  team: Team,
  action: Function,
  host: string,
  setTeams: Function
) {
  return (
    <div className="confirmPopUpCanvas" id="confirmPopUpCanvas">
      <div className="confirmPopUpWrapper">
        <div className="closeCrossWrapper">
          <div className="closeCross" onClick={closeWindow}>
            X
          </div>
        </div>
        <h3 className="popUpHeader">Вы уверены, что хотите удалить:{team.name}??</h3>
        <div className="buttonsWrapper">
          <button className="submitFormButton" onClick={submit}>
            SUBMIT
          </button>
          <button className="submitFormButton" onClick={closeWindow}>
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );

  function closeWindow() {
    const element = document.getElementById('confirmPopUpCanvas');
    if (element) element.style.visibility = 'hidden';
    const body = document.getElementsByTagName('body')[0];
    if (body) body.style.overflow = 'scroll';
  }
  async function submit() {
    await action(host, team).then(async (result: any) => {
      if (result === 200) {
        await setTeams((teams: Team[]) => {
          const updatedTeams = [];
          for (let item of teams) if (item.id !== team.id) updatedTeams.push(item);
          return updatedTeams;
        });
        closeWindow();
      }
    });
  }
}
