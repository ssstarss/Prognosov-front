import { User } from '../FillBase/types';
import { updateData } from '../../../functions/updateData';

export interface UpdateUserFormData {
  name: string;
  email: string;
  cellphone: string;
  city?: string;
  country?: string;
  avatar?: string | null;
}

export interface UpdateUserCallbacks {
  setUser: (user: User) => void;
  onSuccess: () => void;
}

/**
 * Собирает данные формы в объект пользователя, отправляет на сервер,
 * при успехе обновляет состояние и вызывает onSuccess, при ошибке показывает alert.
 */
export async function updateUser(
  user: User,
  formData: UpdateUserFormData,
  callbacks: UpdateUserCallbacks
): Promise<void> {
  const updatedUser: User = {
    ...user,
    name: formData.name,
    email: formData.email,
    cellphone: formData.cellphone,
    city: formData.city ?? user.city,
    country: formData.country ?? user.country ,
    avatar: formData.avatar ?? user.avatar,
  };
  const requestData: Partial<User> = { ...updatedUser };
  if (formData.avatar === undefined) {
    delete requestData.avatar;
  }

  try {
    const result = await updateData(`/users/${user.id}`, requestData as User);
    if (result === 200) {
      callbacks.setUser(updatedUser);
      callbacks.onSuccess();
    } else if (result !== undefined) {
      alert(`Ошибка обновления данных. Статус: ${result}`);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    alert(`Ошибка при обновлении данных: ${message}`);
  }
}
