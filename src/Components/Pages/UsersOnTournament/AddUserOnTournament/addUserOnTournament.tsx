import { useState } from 'react';

import { Tournament, User, UserOnTournament } from '../../FillBase/types';
import './addUserOnTournament.scss';
import { createData } from '../../FillBase/fetchData';
import ConfirmPopUp from '../../../ConfirmPopUp/confirmPopup';
import ChooseOptionWithFilter from '../../../../Components/chooseOption/withFilter/chooseOptionFilter';

export default function AddUserOnTournament(props: {
  currentTournament: Tournament;
  users: User[] | undefined;
  onClose?: () => void;
  onAdded: (users: UserOnTournament[]) => void;
}) {
  const [currentUser, setCurrentUser] = useState<User>({} as User);
  const [showModal, setShowModal] = useState(false);
  const listHost = `/usersOnTournament/${props.currentTournament.id}`;
  return (
    <div className="addUserOnTournamentPageWrapper">
      {showModal && (
        <ConfirmPopUp
          message="Are you sure you want to add this user to the tournament?"
          data={{ userID: currentUser.id, tournamentID: props.currentTournament.id }}
          action={async (_host: string, data: { userID: number; tournamentID: number }) => {
            await createData(`/usersOnTournaments`, data);
            /* ConfirmPopUp обновляет список только при result === 200 (как deleteData/addData) */
            return 200;
          }}
          host={listHost}
          setData={async (updated: UserOnTournament[]) => {
            props.onAdded(updated);
            props.onClose?.();
          }}
          setShowModal={setShowModal}
        />
      )}

      <div className="addUserOnTournamentForm">
        <h2 className="addUserOnTournamentHeader">Add User On Tournament</h2>
        <ChooseOptionWithFilter<User>
          currentOption={currentUser}
          setChosenOption={setCurrentUser}
          options={props.users}
        />
        <div className="buttonsWrapper">
          <button
            className="submitFormButton"
            onClick={() => {
              if (currentUser.id && props.currentTournament.id) setShowModal(true);
            }}
          >
            Add User
          </button>
          <button
            className="submitFormButton"
            onClick={() => props.onClose?.()}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
