import { useEffect, useState } from 'react';
import './userProfile.scss';
import fetchData from '../../../functions/fetchData';
import { User } from '../FillBase/types';
import { appState } from '../../../constants';
import loginRefresh from '../../../functions/loginRefresh';
import { PopUpCanvas } from '../../PopUpCanvas/popUpCanvas';
import EditUserForm from './editUserForm';

export default function UserProfile() {
  const [user, setUser] = useState<User>();
  const [popUp, setPopUp] = useState(() => {
    return <></>;
  });

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

  const handleEditClick = () => {
    if (user) {
      setPopUp(<EditUserForm user={user} setUser={setUser} />);
    }
  };

  return (
    <div className="userProfilePageWrapper">
      <PopUpCanvas PopUp={popUp}></PopUpCanvas>
      <div className="userProfileForm">
        <h2 className="userProfilePageHeader">User Profile</h2>
        <h3 className="userProfilePageHeader">FIO: {user?.name}</h3>
        <h3 className="userProfilePageHeader">EMAIL: {user?.email}</h3>
        <h3 className="userProfilePageHeader">CELLPHONE: {user?.cellphone}</h3>
        <h3 className="userProfilePageHeader">ROLE: {user?.role}</h3>
        <h3 className="userProfilePageHeader">CITY: {user?.city}</h3>
        <h3 className="userProfilePageHeader">COUNTRY: {user?.country}</h3>
        <button className="userProfilePageHeader" onClick={handleEditClick}>
          EDIT
        </button>
      </div>
    </div>
  );
}
