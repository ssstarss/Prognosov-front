import { UserProfile } from '../FillBase/types';
import { updateData } from '../../../functions/updateData';

export interface UpdateUserFormData {
  name: string;
  email: string;
  cellphone: string;
  city?: string;
  country?: string;
  avatar?: string | null;
}

/**
 * Собирает данные формы в объект пользователя, отправляет на сервер,
 * при успехе обновляет состояние и вызывает onSuccess, при ошибке показывает alert.
 */
export async function updateUser(
  user: UserProfile,
  formData: UpdateUserFormData,
  callbacks: {
    setUser: (user: UserProfile) => void;
    onSuccess: () => void;
    onUpdated?: (user: UserProfile) => void;
  }
): Promise<void> {
  const updatedUser: UserProfile = {
    ...user,
    name: formData.name,
    email: formData.email,
    cellphone: formData.cellphone,
    city: formData.city ?? user.city,
    country: formData.country ?? user.country,
    avatar: formData.avatar ?? user.avatar,
  };
  const requestData: UpdateUserFormData = {
    name: updatedUser.name,
    email: updatedUser.email,
    cellphone: updatedUser.cellphone,
    city: updatedUser.city,
    country: updatedUser.country,
    avatar:
      typeof updatedUser.avatar === 'string' || updatedUser.avatar === null
        ? updatedUser.avatar
        : undefined,
  };
  if (formData.avatar === undefined) {
    delete requestData.avatar;
  }

  try {
    const result = await updateData(`/users/${user.id}`, requestData);
    if (result === 200) {
      callbacks.setUser(updatedUser);
      callbacks.onUpdated?.(updatedUser);
      callbacks.onSuccess();
    } else if (result !== undefined) {
      alert(`Ошибка обновления данных. Статус: ${result}`);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    alert(`Ошибка при обновлении данных: ${message}`);
  }
}
