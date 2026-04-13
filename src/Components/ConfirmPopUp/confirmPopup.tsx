import fetchData from '../../functions/fetchData';
import { Team } from '../../interfaces/interfaces';
import { Competition, User, Tournament, UserOnTournament } from '../Pages/FillBase/types';
import './confirmPopUp.css';

export default function ConfirmPopUp(props: {
  message: string;
  data:
    | Team
    | Competition
    | User
    | Tournament
    | UserOnTournament
    | { userID: number; tournamentID: number };
  action: Function;
  host: string;
  setData: Function;
  setShowModal: Function;
}) {
  return (
    <div className="confirmPopUpWrapper" onClick={(e) => e.stopPropagation()}>
      <div className="closeCrossWrapper">
        <div className="closeCross" onClick={() => props.setShowModal(false)}>
          X
        </div>
      </div>
      <h3 className="popUpHeader">{props.message}</h3>
      <div className="buttonsWrapper">
        <button className="submitFormButton" onClick={submit}>
          SUBMIT
        </button>
        <button className="submitFormButton" onClick={() => props.setShowModal(false)}>
          CANCEL
        </button>
      </div>
    </div>
  );

  async function submit() {
    await props.action(props.host, props.data).then(async (result: any) => {
      console.log('result in confirmPopup', result);
      if (result === 200) {
        const updatedData = await fetchData(props.host);
        if (props.setData) {
          await props.setData(updatedData as Team[] | Competition[] | User[] | UserOnTournament[]);
        }
      }
      if (result === 206) props.setData();
    });
    props.setShowModal(false);
  }
}
