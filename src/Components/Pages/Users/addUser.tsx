import { Dispatch, SetStateAction, useState } from 'react';
import './addUser.scss';
import { createData } from '../FillBase/fetchData';
import { User } from '../FillBase/types';
import fetchData from '../../../functions/fetchData';

export default function AddUser(props: {
  onClose: () => void;
  setUsers: Dispatch<SetStateAction<User[]>>;
}) {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  
  return (
    <div className="addUserPageWrapper">
    <div className="addUserForm" onClick={(e) => e.stopPropagation()}>
      <h2>Add User</h2>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}  />
      <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}  />
      <input type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}  />
      <input type="text" placeholder="Cellphone" value={cellphone} onChange={(e) => setCellphone(e.target.value)}  />
      <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)}  />
      <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)}  />
      <button
        type="button"
        onClick={async () => {
          props.onClose();
          const data = { name, email, password, cellphone, city, country, active: true };
          await createData(`/users`, {...data});
          await fetchData(`/users`, props.setUsers);
        }}
      >
        Add User
      </button>
      <button type="button" onClick={() => props.onClose()}>
        Cancel
      </button>   
    </div>
    </div>
  );
}