import { useCallback, useEffect, useState, type ReactElement } from 'react';
import './userProfile.scss';
import fetchData from '../../../functions/fetchData';
import { User } from '../FillBase/types';
import { appState } from '../../../constants';
import loginRefresh from '../../../functions/loginRefresh';
import { PopUpCanvas } from '../../PopUpCanvas/popUpCanvas';
import EditUserForm from './editUserForm';
import AvatarCircle from '../../common/AvatarCircle';

export default function UserProfile() {
  const [user, setUser] = useState<User>();
  const [popUp, setPopUp] = useState<ReactElement | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      // Убеждаемся, что пользователь залогинен и userID установлен
      if (!appState.userID) {
        await loginRefresh();
      }

      // Проверяем userID после refresh
      if (appState.userID) {
        fetchData(`/users/${appState.userID}`, setUser);
      }
    };

    loadUserData();
  }, []);

  const handleEditClose = useCallback(() => {
    setPopUp(null);
  }, []);

  const handleEditClick = () => {
    if (user) {
      setPopUp(<EditUserForm user={user} setUser={setUser} onClose={handleEditClose} />);
    }
  };
  return (
    <div className="pageWrapper">
      <PopUpCanvas PopUp={popUp} onClose={handleEditClose}></PopUpCanvas>
      <div className="formWrapper">
        <div className="formHeaderWrapper">
          <h2 className="formHeader">User Profile</h2>
        </div>
        <div className="userDataWrapper">
          <div className="userProfileAvatarWrapper">
            <AvatarCircle
              avatar={user?.avatar}
              className="userProfileAvatar"
              placeholderClassName="userProfileAvatarPlaceholder"
            />
          </div>
          <div className="userProfileDataWrapper">
            <h3 className="userProfileDataLabel">FIO:</h3>
            <h3 className="userProfileDataValue">{user?.name}</h3>
          </div>
          <div className="userProfileDataWrapper">
            <h3 className="userProfileDataLabel">EMAIL:</h3>
            <h3 className="userProfileDataValue">{user?.email}</h3>
          </div>
        </div>
        <div className="userProfileDataWrapper">
          <h3 className="userProfileDataLabel">CELLPHONE:</h3>
          <h3 className="userProfileDataValue">{user?.cellphone}</h3>
        </div>
        <div className="userProfileDataWrapper">
          <h3 className="userProfileDataLabel">ROLE:</h3>
          <h3 className="userProfileDataValue">{user?.role}</h3>
        </div>
        <div className="userProfileDataWrapper">
          <h3 className="userProfileDataLabel">CITY:</h3>
          <h3 className="userProfileDataValue">{user?.city}</h3>
        </div>
        <div className="userProfileDataWrapper">
          <h3 className="userProfileDataLabel">COUNTRY:</h3>
          <h3 className="userProfileDataValue">{user?.country}</h3>
        </div>
        <button className="submitFormButton shortButton" onClick={handleEditClick}>
          EDIT
        </button>
      </div>
    </div>
  );
}
