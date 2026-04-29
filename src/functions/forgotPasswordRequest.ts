import { SERVER } from '../constants';
import { getErrorMessageFromData } from './errorMessage';
import { notifyError } from '../Components/common/notifications/notificationBus';

export interface ForgotPasswordRequestResult {
  success: boolean;
  error?: string;
}

export async function forgotPasswordRequest(email: string): Promise<ForgotPasswordRequestResult> {
  try {
    const response = await fetch(`${SERVER}/auth/forgot-password-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok) {
      const errorMessage = getErrorMessageFromData(data, 'Ошибка запроса');
      notifyError(errorMessage);
      return { success: false, error: errorMessage };
    }

    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Ошибка сети';
    notifyError(msg);
    return { success: false, error: msg };
  }
}
