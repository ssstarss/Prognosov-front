import './users.scss';
import '../../common/ListRow.css';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import fetchData from '../../../functions/fetchData';
import ModalWrapper from '../../ModalPortal/modalWrapper';
import { UserProfile } from '../../../interfaces/types';
import UserModalForm from '../UserProfile/UserModalForm';
import ConfirmPopUp from '../../ConfirmPopUp/confirmPopup';
import { deleteData } from '../../../functions/updateData';
import AvatarCircle from '../../common/AvatarCircle';
import EntityPageLayout from '../../common/EntityPageLayout';
import EntityListRow from '../../common/EntityListRow';

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
      <EntityListRow
        key={user.id}
        className="userLine"
        name={user.name}
        leading={
          <AvatarCircle
            avatar={user.avatar}
            alt={user.name}
            className="userAvatar"
            placeholderClassName="userAvatarPlaceholder"
            placeholderText={user.name?.charAt(0).toUpperCase() || '?'}
          />
        }
        onEdit={() => {
          setUser(user);
          setShowModalEdit(true);
        }}
        onDelete={() => {
          setUser(user);
          setShowModalDelete(true);
        }}
      />
    );
  });
  return (
    <div className="pageWrapper">
      <EntityPageLayout
        title="USERS"
        className="usersForm"
        action={
          <button
            className="submitFormButton shortButton"
            onClick={() => {
              setShowModalAddUser(true);
            }}
          >
            ADD USER
          </button>
        }
      >
        <ul className="usersList listScrollable">{listUsers}</ul>
      </EntityPageLayout>
      {showModalAddUser &&
        createPortal(
          <ModalWrapper showModal={showModalAddUser} setShowModal={setShowModalAddUser}>
            <UserModalForm
              mode="add"
              setUsers={setUsers}
              onClose={() => setShowModalAddUser(false)}
            />
          </ModalWrapper>,
          document.body
        )}
      {showModalEdit &&
        createPortal(
          <ModalWrapper showModal={showModalEdit} setShowModal={setShowModalEdit}>
            <UserModalForm
              user={user}
              setUser={setUser}
              setUsers={setUsers}
              onClose={() => setShowModalEdit(false)}
            />
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
