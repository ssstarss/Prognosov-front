import { Dispatch, SetStateAction, useState } from 'react';
import './addUser.scss';
import { createData } from '../FillBase/fetchData';
import { UserProfile } from '../FillBase/types';
import fetchData from '../../../functions/fetchData';
import UserForm from '../UserProfile/UserForm';
import { RegisterFormData } from '../../../interfaces/interfaces';

export default function AddUser(props: {
  onClose: () => void;
  setUsers: Dispatch<SetStateAction<UserProfile[]>>;
}) {
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (formData: RegisterFormData) => {
    setSubmitError('');
    try {
      const data = { ...formData, active: true };
      await createData(`/users`, data);
      await fetchData(`/users`, props.setUsers);
      props.onClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Не удалось добавить пользователя';
      setSubmitError(message);
    }
  };

  return (
    <div className="addUserForm" onClick={(e) => e.stopPropagation()}>
      <UserForm
        mode="register"
        initialData={{}}
        onSubmit={handleSubmit}
        submitButtonText="Add User"
        title="Add User"
        onClose={props.onClose}
        useFormWrapper={false}
      />
      {submitError && <p className="addUserError">{submitError}</p>}
    </div>
  );
}
