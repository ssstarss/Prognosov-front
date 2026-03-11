import fetchData from '../../functions/fetchData';
import { Team } from '../../interfaces/interfaces';
import { Competition, User } from '../Pages/FillBase/types';
import './confirmPopUp.css';

export default function ConfirmPopUp(props: {
  message: string;
  data: Team | Competition | User;
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
      if (result === 200) {
        const updatedData = await fetchData(props.host);
        if (props.setData) {
          await props.setData(updatedData as Team[] | Competition[] | User[]);
        }
        props.setShowModal(false);
      } 
    });
  }
}
