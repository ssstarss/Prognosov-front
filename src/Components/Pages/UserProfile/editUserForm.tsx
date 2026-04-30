import './editUserForm.css';
import { UserProfile } from '../FillBase/types';
import { updateUser } from './updateUser';
import UserForm, { UserFormData } from './UserForm';
import type React from 'react';

interface EditUserFormProps {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  setUsers?: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  onClose: () => void;
}

export default function EditUserForm({ user, setUser, setUsers, onClose }: EditUserFormProps) {
  const handleSubmit = async (data: UserFormData) => {
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
  };

  return (
    <div className="pageWrapper" onClick={(e) => e.stopPropagation()}>
      <UserForm
        mode="edit"
        initialData={{
          name: user.name,
          email: user.email,
          cellphone: user.cellphone,
          city: user.city,
          country: user.country,
          avatar:
            typeof user.avatar === 'string' ? user.avatar : undefined,
        }}
        onSubmit={handleSubmit}
        onClose={onClose}
      />
    </div>
  );
}
