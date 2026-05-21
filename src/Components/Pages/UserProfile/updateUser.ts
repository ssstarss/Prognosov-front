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
  },
  options?: { skipEmail?: boolean }
): Promise<boolean> {
  const email = options?.skipEmail ? user.email : formData.email;
  const updatedUser: UserProfile = {
    ...user,
    name: formData.name,
    email,
    cellphone: formData.cellphone,
    city: formData.city ?? user.city,
    country: formData.country ?? user.country,
    avatar: formData.avatar ?? user.avatar,
  };
  const requestData: Partial<UpdateUserFormData> & Pick<UpdateUserFormData, 'name' | 'cellphone'> = {
    name: updatedUser.name,
    cellphone: updatedUser.cellphone,
    city: updatedUser.city,
    country: updatedUser.country,
    avatar:
      typeof updatedUser.avatar === 'string' || updatedUser.avatar === null
        ? updatedUser.avatar
        : undefined,
  };
  if (!options?.skipEmail) {
    requestData.email = updatedUser.email;
  }
  if (formData.avatar === undefined) {
    delete requestData.avatar;
  }

  try {
    const result = await updateData(`/users/${user.id}`, requestData);
    if (result === 200) {
      callbacks.setUser(updatedUser);
      callbacks.onUpdated?.(updatedUser);
      callbacks.onSuccess();
      return true;
    }
    if (result !== undefined) {
      alert(`Ошибка обновления данных. Статус: ${result}`);
    }
    return false;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    alert(`Ошибка при обновлении данных: ${message}`);
    return false;
  }
}
