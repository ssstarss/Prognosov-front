import { useEffect, useState } from 'react';

import { Tournament, User } from '../../FillBase/types';
import './addUserOnTournament.scss';
import { createData } from '../../FillBase/fetchData';
import ConfirmPopUp from '../../../ConfirmPopUp/confirmPopup';
import ChooseOptionWithFilter from '../../../../Components/chooseOption/withFilter/chooseOptionFilter';

export default function AddUserOnTournament(props: {
  currentTournament: Tournament;
  users: User[] | undefined;
  onClose?: () => void;
}) {
  const [currentUser, setCurrentUser] = useState<User>({} as User);
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="addUserOnTournamentPageWrapper">
      {showModal && (
        <ConfirmPopUp
          message="Are you sure you want to add this user to the tournament?"
          data={{ userID: currentUser.id, tournamentID: props.currentTournament.id }}
          action={async () => {
            await createData(`/usersOnTournaments`, {
              userID: currentUser.id,
              tournamentID: props.currentTournament.id,
            });
          }}
          host={`/usersOnTournament`}
          setData={setCurrentUser}
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
