import { useEffect, useState } from 'react';
import './usersOnTornament.scss';
import '../../common/ListRow.css';
import fetchData from '../../../functions/fetchData';
import {  User, UserOnTournament } from '../../../interfaces/types';
import { deleteData } from '../../../functions/updateData';
import ConfirmPopUp from '../../ConfirmPopUp/confirmPopup';
import AddUserOnTournament from './AddUserOnTournament/addUserOnTournament';
import ModalWrapper from '../../ModalPortal/modalWrapper';
import EntityPageLayout from '../../common/EntityPageLayout';
import EntityListRow from '../../common/EntityListRow';
import { createPortal } from 'react-dom';
import {useTournamentContext} from '../../../context/TournamentContext';
export default function UsersOnTournament() {
  const { currentTournament, setCurrentTournament } = useTournamentContext();
  const [usersOnTournament, setUsersOnTournament] = useState<UserOnTournament[]>(
    [] as UserOnTournament[]
  );
  
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
    <EntityListRow
      key={user.userID}
      className="userLine"
      name={user.user.name}
      onDelete={() => {
        setUser(user);
        setShowModalDelete(true);
      }}
    />
  ));

  return (
    <div className="pageWrapper">
      {showModalDelete &&
        createPortal(
          <ModalWrapper showModal={showModalDelete} setShowModal={setShowModalDelete}>
            <ConfirmPopUp
              message={`It is strongly not recommended to delete a user from a tournament. he already has ${user.prognoses?.length} prognoses? Are you sure?`}
              data={user}
              action={deleteData}
              host={`/userOnTournament?tournamentID=${currentTournament.id}&userID=${user.userID}`}
              setData={() =>
                fetchData(`/usersOnTournament/${currentTournament.id}`, setUsersOnTournament)
              }
              setShowModal={setShowModalDelete}
            />
          </ModalWrapper>,
          document.body
        )}
      {showModalAddUser && (
        <ModalWrapper showModal={showModalAddUser} setShowModal={setShowModalAddUser}>
          <AddUserOnTournament
            currentTournament={currentTournament}
            users={users}
            onClose={() => setShowModalAddUser(false)}
            onAdded={(list) => setUsersOnTournament(list)}
          />
        </ModalWrapper>
      )}
      <EntityPageLayout
        title="Users On Tournament"
        className="usersOnTornamentForm"
        
        action={
          <button
            className="submitFormButton shortButton"
            onClick={() => setShowModalAddUser(true)}
          >
            Add User
          </button>
        }
      >
        <ul className="usersOnTournamentList listScrollable">{listUsersOnTournament}</ul>
      </EntityPageLayout>
    </div>
  );
}
