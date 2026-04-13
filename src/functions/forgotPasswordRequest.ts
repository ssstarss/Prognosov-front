import { SERVER } from '../constants';

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
      return { success: false, error: data.message || data.error || 'Ошибка запроса' };
    }

    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Ошибка сети';
    return { success: false, error: msg };
  }
}
