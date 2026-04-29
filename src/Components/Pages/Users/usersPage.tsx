import './users.scss';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import fetchData from '../../../functions/fetchData';
import ModalWrapper from '../../ModalPortal/modalWrapper';
import AddUser from './addUser';
import { UserProfile } from '../FillBase/types';
import EditUserForm from '../UserProfile/editUserForm';
import ConfirmPopUp from '../../ConfirmPopUp/confirmPopup';
import { deleteData } from '../../../functions/updateData';
import AvatarCircle from '../../common/AvatarCircle';

export default function UsersPage() {
  let [users, setUsers] = useState<UserProfile[]>([] as UserProfile[]);
  const [showModalAddUser, setShowModalAddUser] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [user, setUser] = useState<UserProfile>({} as UserProfile);
  useEffect(() => {
    const users = fetchData(`/users`, setUsers);
  }, []);

  const listUsers = users?.map((user) => {
    return (
      <li className="userLine" key={user.id}>
        <div className="userLine__wrapper">
          <AvatarCircle
            avatar={user.avatar}
            alt={user.name}
            className="userAvatar"
            placeholderClassName="userAvatarPlaceholder"
            placeholderText={user.name?.charAt(0).toUpperCase() || '?'}
          />
          <h3 className="userLine__name">{user.name}</h3>
        </div>
        <div className="userLine__buttons">
          <button
            className="editIcon"
            onClick={() => {
              setUser(user);
              setShowModalEdit(true);
            }}
          >
            E
          </button>
          <button
            className="deleteIcon"
            onClick={() => {
              setUser(user);
              setShowModalDelete(true);
            }}
          >
            D
          </button>
        </div>
      </li>
    );
  });
  return (
    <div className="pageWrapper">
      <div className="formWrapper usersForm">
        <div className="formHeaderWrapper ">
          <h2 className="formHeader">USERS </h2>
        </div>
        <div className="usersList__wrapper">
          <ul className="usersList">{listUsers}</ul>
        </div>
        <button
          className="submitFormButton shortButton"
          onClick={() => {
            setShowModalAddUser(true);
          }}
        >
          ADD USER
        </button>
      </div>
      {showModalAddUser &&
        createPortal(
          <ModalWrapper showModal={showModalAddUser} setShowModal={setShowModalAddUser}>
            <AddUser onClose={() => setShowModalAddUser(false)} setUsers={setUsers} />
          </ModalWrapper>,
          document.body
        )}
      {showModalEdit &&
        createPortal(
          <ModalWrapper showModal={showModalEdit} setShowModal={setShowModalEdit}>
            <EditUserForm user={user} setUser={setUser} onClose={() => setShowModalEdit(false)} />
          </ModalWrapper>,
          document.body
        )}
      {showModalDelete &&
        createPortal(
          <ModalWrapper showModal={showModalDelete} setShowModal={setShowModalDelete}>
            <ConfirmPopUp
              data={user}
              message={`Вы уверены, что хотите удалить: ${user.name}?`}
              action={deleteData}
              host={`/users/${user.id}`}
              skipFetchAfterAction={true}
              setData={async () => {
                await fetchData(`/users`, setUsers);
              }}
              setShowModal={setShowModalDelete}
            />
          </ModalWrapper>,
          document.body
        )}
    </div>
  );
}
