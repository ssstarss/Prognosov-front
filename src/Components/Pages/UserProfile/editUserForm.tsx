import './editUserForm.css';
import { User } from '../FillBase/types';
import { close__popUp } from '../../PopUpCanvas/popUpCanvas';
import { updateUser } from './updateUser';
import UserForm, { UserFormData } from './UserForm';

interface EditUserFormProps {
  user: User;
  setUser: (user: User) => void;
}

export default function EditUserForm({ user, setUser }: EditUserFormProps) {
  const handleSubmit = async (data: UserFormData) => {
    await updateUser(
      user,
      { fio: data.fio, email: data.email, cellphone: data.cellphone, city: data.city, country: data.country },
      { setUser, onSuccess: close__popUp }
    );
  };

  return (
    <div className="editUserFormWrapper" onClick={(e) => e.stopPropagation()}>
      <UserForm
        mode="edit"
        initialData={{
          fio: user.fio,
          email: user.email,
          cellphone: user.cellphone,
          city: user.city,
          country: user.country,
        }}
        onSubmit={handleSubmit}
        onClose={close__popUp}
      />
    </div>
  );
}
