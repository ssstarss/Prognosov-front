import './editUserForm.css';
import { UserProfile } from '../FillBase/types';
import { updateUser } from './updateUser';
import UserForm, { UserFormData } from './UserForm';
import type React from 'react';
import { createData } from '../FillBase/fetchData';
import fetchData from '../../../functions/fetchData';
import { useState } from 'react';

interface EditUserFormProps {
  mode?: 'edit' | 'add';
  user?: UserProfile;
  setUser?: (user: UserProfile) => void;
  setUsers?: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  onClose: () => void;
}

export default function UserModalForm({
  mode = 'edit',
  user,
  setUser,
  setUsers,
  onClose,
}: EditUserFormProps) {
  const [submitError, setSubmitError] = useState('');
  const isEditMode = mode === 'edit';

  const handleSubmit = async (data: UserFormData) => {
    setSubmitError('');
    if (isEditMode) {
      if (!user || !setUser) return;
      await updateUser(
        user,
        {
          name: data.name,
          email: data.email,
          cellphone: data.cellphone,
          city: data.city,
          country: data.country,
          avatar: data.avatar,
        },
        {
          setUser,
          onUpdated: (updatedUser) => {
            setUsers?.((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
          },
          onSuccess: onClose,
        }
      );
      return;
    }

    try {
      if (!setUsers) return;
      const payload = { ...data, active: true };
      await createData('/users', payload);
      await fetchData('/users', setUsers);
      onClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Не удалось добавить пользователя';
      setSubmitError(message);
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <UserForm
        mode={isEditMode ? 'edit' : 'register'}
        initialData={
          isEditMode && user
            ? {
                name: user.name,
                email: user.email,
                cellphone: user.cellphone,
                city: user.city,
                country: user.country,
                avatar: typeof user.avatar === 'string' ? user.avatar : undefined,
              }
            : {}
        }
        onSubmit={handleSubmit}
        title={isEditMode ? 'Edit User' : 'Add User'}
        submitButtonText={isEditMode ? 'Save' : 'Add User'}
        onClose={onClose}
        useFormWrapper={false}
      />
      {submitError && <p className="addUserError">{submitError}</p>}
    </div>
  );
}
