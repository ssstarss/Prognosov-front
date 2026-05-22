import fetchData from '../../functions/fetchData';
import { Team } from '../../interfaces/interfaces';
import {
  Competition,
  User,
  UserProfile,
  Tournament,
  UserOnTournament,
} from '../../interfaces/types';
import './confirmPopUp.css';

export default function ConfirmPopUp(props: {
  message: string;
  data:
    | Team
    | Competition
    | User
    | UserProfile
    | Tournament
    | UserOnTournament
    | { userID: number; tournamentID: number };
  action: Function;
  host: string;
  setData: Function;
  setShowModal: Function;
  skipFetchAfterAction?: boolean;
}) {
  return (
    <div className="formWrapper" onClick={(e) => e.stopPropagation()}>
      <div className="closeCrossWrapper">
        <div className="closeCross" onClick={() => props.setShowModal(false)}>
          X
        </div>
      </div>
      <div className="formHeaderWrapper">
        <h3 className="formHeader">Удаление</h3>
      </div>
      <div className="formBody">
        <h3 className="formBodyText">{props.message}</h3>
      </div>
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
        if (props.setData) {
          if (props.skipFetchAfterAction) {
            await props.setData();
          } else {
            const updatedData = await fetchData(props.host);
            await props.setData(
              updatedData as Team[] | Competition[] | User[] | UserOnTournament[]
            );
          }
        }
      }
      if (result === 206) props.setData();
    });
    props.setShowModal(false);
  }
}
