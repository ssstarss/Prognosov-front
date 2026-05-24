import { SERVER } from '../constants';
import { RegisterFormData } from '../interfaces/interfaces';
import { getErrorMessageFromData } from './errorMessage';

export interface RegisterConfirmResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  userID?: number;
  codeValid?: boolean;
  attemptsLeft?: number;
  error?: string;
}

export async function registerConfirm(
  email: string,
  code: string,
  formData: RegisterFormData
): Promise<RegisterConfirmResult> {
  try {
    const response = await fetch(`${SERVER}/auth/register-confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, userData: formData }),
    });
    const data = await response.json();
    if (response.ok && data.accessToken) {
      return { success: true, accessToken: data.accessToken, refreshToken: data.refreshToken, userID: data.userID };
    }
    return {
      success: false,
      codeValid: data.codeValid === false ? false : undefined,
      attemptsLeft: data.attemptsLeft,
      error: getErrorMessageFromData(data, 'Ошибка подтверждения регистрации'),
    };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Ошибка сети';
    return { success: false, error: msg };
  }
}
