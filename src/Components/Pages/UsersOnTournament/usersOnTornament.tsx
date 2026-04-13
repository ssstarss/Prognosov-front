import { useEffect, useState } from 'react';
import './usersOnTornament.scss';
import fetchData from '../../../functions/fetchData';
import { Tournament, User, UserOnTournament } from '../FillBase/types';
import { appState } from '../../../constants';
import ChooseOption from '../../chooseOption/chooseOption';
import { deleteData } from '../../../functions/updateData';
import ConfirmPopUp from '../../ConfirmPopUp/confirmPopup';
import AddUserOnTournament from './AddUserOnTournament/addUserOnTournament';
import ModalWrapper from '../../ModalPortal/modalWrapper';
export default function UsersOnTournament() {
  const [currentTournament, setCurrentTournament] = useState<Tournament>(
    appState.currentTournament
  );
  const [usersOnTournament, setUsersOnTournament] = useState<UserOnTournament[]>(
    [] as UserOnTournament[]
  );
  const [tournaments, setTournaments] = useState<Tournament[]>([] as Tournament[]);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [user, setUser] = useState<UserOnTournament>({} as UserOnTournament);
  const [showModalAddUser, setShowModalAddUser] = useState(false);
  const [users, setUsers] = useState<User[]>([] as User[]);
  useEffect(() => {
    fetchData(`/users`, setUsers);
  }, []);
  useEffect(() => {
    fetchData(`/usersOnTournament/${currentTournament.id}`, setUsersOnTournament);
  }, [currentTournament.id]);
  const listUsersOnTournament = usersOnTournament.map((user) => (
    <li key={user.userID}>
      <div className="userLine">
        <button
          className="deleteIcon"
          onClick={() => {
            setUser(user);
            setShowModalDelete(true);
          }}
        >
          D
        </button>
        <div className="userName">{user.user.name}</div>
      </div>
    </li>
  ));
  useEffect(() => {
    fetchData(`/tournaments`, setTournaments);
  }, []);
  return (
    <div className="usersOnTornamentPageWrapper">
      {showModalDelete && (
        <ConfirmPopUp
          message={`It is strongly not recommended to delete a user from a tournament. he already has ${user.prognoses?.length} prognoses? Are you sure?`}
          data={user}
          action={deleteData}
          host={`/userOnTournament?tournamentID=${currentTournament.id}&userID=${user.userID}`}
          setData={() => fetchData(`/usersOnTournament/${currentTournament.id}`, setUsersOnTournament)}
          setShowModal={setShowModalDelete}
        />
      )}
      {showModalAddUser && (
        <ModalWrapper showModal={showModalAddUser} setShowModal={setShowModalAddUser}>
          <AddUserOnTournament
            currentTournament={currentTournament}
            users={users}
            onClose={() => setShowModalAddUser(false)}
          />
        </ModalWrapper>
      )}
      <div className="usersOnTornamentForm">
        <h2 className="usersOnTornamentPageHeader">Users On Tournament</h2>
        <ChooseOption<Tournament>
          currentOption={currentTournament}
          setChosenOption={setCurrentTournament}
          options={tournaments}
        />
        <h4>{listUsersOnTournament}</h4>
        <button className="submitFormButton" onClick={() => setShowModalAddUser(true)}>
          Add User
        </button>
      </div>
    </div>
  );
  
}
