import { useState } from 'react';
import { Tournament, User, UserOnTournament } from '../../../../interfaces/types';
import './addUserOnTournament.scss';
import '../../../common/ModalEntityForm.scss';
import ConfirmPopUp from '../../../ConfirmPopUp/confirmPopup';
import ChooseOptionWithFilter from '../../../../Components/chooseOption/withFilter/chooseOptionFilter';
import EntityModalForm from '../../../common/EntityModalForm';
import { addData } from '../../../../functions/updateData';

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
    <div className="addUserOnTournamentPageWrapper modalEntityFormWrapper">
      {showModal && (
        <ConfirmPopUp
          message="Are you sure you want to add this user to the tournament?"
          data={{ userID: currentUser.id, tournamentID: props.currentTournament.id }}
          action={async (_host: string, data: { userID: number; tournamentID: number }) => {
            await addData(`/usersOnTournaments`, { data: { ...data } as UserOnTournament });
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

      <EntityModalForm
        title="Add User On Tournament"
        onClose={() => props.onClose?.()}
        className="addUserOnTournamentForm"
        actions={
          <>
            <button
              className="submitFormButton shortButton"
              onClick={() => {
                if (currentUser.id && props.currentTournament.id) setShowModal(true);
              }}
            >
              Add User
            </button>
            <button className="submitFormButton shortButton" onClick={() => props.onClose?.()}>
              CANCEL
            </button>
          </>
        }
      >
        <div className="modalEntityFieldBlock">
          <h3 className="modalEntityFieldLabel">User</h3>
          <ChooseOptionWithFilter<User>
            currentOption={currentUser}
            setChosenOption={setCurrentUser}
            options={props.users}
          />
        </div>
      </EntityModalForm>
    </div>
  );
}
