import './users.css';
import { useEffect, useState } from 'react';

import fetchData from '../../../functions/fetchData';

type User = {
  id: number;
  fio: string;
  email: string;
  password: string;
  cellphone: string;
  avatar: BinaryType;
  role: string;
  city: string;
  country: string;
};

export default function UsersPage() {
  let [users, setUsers] = useState<User[]>();
  useEffect(() => {
    fetchData('users', setUsers);
  }, []);

  const listTeams = users?.map((user) => <li key={user.id}>{user.fio} </li>);
  return (
    <div className="usersPageWrapper">
      <div className="usersForm">
        <h2 className="usersPageHeader">USERS registered on Server:</h2>

        <h4> {listTeams}</h4>
      </div>
    </div>
  );
}
