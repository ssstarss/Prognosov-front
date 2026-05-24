import { appState, SERVER } from '../constants';
import { getErrorMessageFromData } from './errorMessage';

export async function changeEmailRequest(
  newEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${SERVER}/auth/change-email-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + appState.accessToken,
      },
      body: JSON.stringify({ newEmail: newEmail.trim() }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: getErrorMessageFromData(data, 'Не удалось отправить код') };
    }
    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Ошибка сети';
    return { success: false, error: msg };
  }
}
