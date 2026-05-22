import { useCallback, useEffect, useState, type ReactElement } from 'react';
import './userProfile.scss';
import fetchData from '../../../functions/fetchData';
import { UserProfile } from '../../../interfaces/types';
import { appState } from '../../../constants';
import loginRefresh from '../../../functions/loginRefresh';
import { PopUpCanvas } from '../../PopUpCanvas/popUpCanvas';
import UserModalForm from './UserModalForm';
import AvatarCircle from '../../common/AvatarCircle';
import EntityPageLayout from '../../common/EntityPageLayout';

export default function UserProfile() {
  const [user, setUser] = useState<UserProfile>();
  const [popUp, setPopUp] = useState<ReactElement | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      // Убеждаемся, что пользователь залогинен и userID установлен
      if (!appState.userID) {
        await loginRefresh();
      }

      // Проверяем userID после refresh
      if (appState.userID) {
        fetchData(`/users/${appState.userID}/profile`, setUser);
      }
    };

    loadUserData();
  }, []);

  const handleEditClose = useCallback(() => {
    setPopUp(null);
  }, []);

  const handleEditClick = () => {
    if (user) {
      setPopUp(<UserModalForm user={user} setUser={setUser} onClose={handleEditClose} />);
    }
  };
  return (
    <div className="pageWrapper">
      <PopUpCanvas PopUp={popUp} onClose={handleEditClose}></PopUpCanvas>
      <EntityPageLayout
        title="User Profile"
        action={
          <button className="submitFormButton shortButton" onClick={handleEditClick}>
            EDIT
          </button>
        }
      >
        <div className="userProfileAvatarWrapper">
          <AvatarCircle
            avatar={user?.avatar}
            className="userProfileAvatar"
            placeholderClassName="userProfileAvatarPlaceholder"
          />
          <div className="userName">
            <h1>{user?.name ?? '-'}</h1>
          </div>
        </div>
        <div className="userProfileDataWrapper">
          <div className=" modalEntityField">
            <h3 className=" modalEntityFieldLabel">Cellphone:</h3>
            <h4 className="listName">{user?.cellphone ?? '-'}</h4>
          </div>
          <div className=" modalEntityField">
            <h3 className=" modalEntityFieldLabel">Role:</h3>
            <h4 className="listName">{user?.role ?? '-'}</h4>
          </div>
          <div className=" modalEntityField">
            <h3 className="modalEntityFieldLabel">City:</h3>
            <h4 className="listName">{user?.city ?? '-'}</h4>
          </div>
          <div className=" modalEntityField">
            <h3 className=" modalEntityFieldLabel">Country:</h3>
            <h4 className="listName">{user?.country ?? '-'}</h4>
          </div>
          <div className=" modalEntityField">
            <h3 className=" modalEntityFieldLabel">Name:</h3>
            <h4 className="listName">{user?.name ?? '-'}</h4>
          </div>
          <div className=" modalEntityField">
            <h3 className=" modalEntityFieldLabel">Email:</h3>
            <h4 className="listName">{user?.email ?? '-'}</h4>
          </div>
        </div>
      </EntityPageLayout>
    </div>
  );
}
