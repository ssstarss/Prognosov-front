import { User } from '../FillBase/types';
import { updateData } from '../../../functions/updateData';
import { SERVER } from '../../../constants';

export interface UpdateUserFormData {
  name: string;
  email: string;
  cellphone: string;
  city: string;
  country: string;
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
    city: formData.city,
    country: formData.country,
  };

  try {
    const result = await updateData(`${SERVER}/users/${user.id}`, updatedUser);
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
