import './editUserForm.css';
import { User } from '../FillBase/types';
import { updateUser } from './updateUser';
import UserForm, { UserFormData } from './UserForm';

interface EditUserFormProps {
  user: User;
  setUser: (user: User) => void;
  onClose: () => void;
}

export default function EditUserForm({ user, setUser, onClose }: EditUserFormProps) {
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
      { setUser, onSuccess: onClose }
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
