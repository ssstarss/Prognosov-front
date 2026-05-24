import { SERVER } from '../constants';
import { getErrorMessageFromData } from './errorMessage';

export interface ForgotPasswordConfirmResult {
  success: boolean;
  attemptsLeft?: number;
  error?: string;
}

export async function forgotPasswordConfirm(
  email: string,
  code: string,
  newPassword: string
): Promise<ForgotPasswordConfirmResult> {
  try {
    const response = await fetch(`${SERVER}/auth/forgot-password-confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, newPassword }),
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        attemptsLeft: data.attemptsLeft,
        error: getErrorMessageFromData(data, 'Ошибка подтверждения'),
      };
    }

    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Ошибка сети';
    return { success: false, error: msg };
  }
}
