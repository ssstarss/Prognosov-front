import { appState, SERVER } from '../constants';
import { getErrorMessageFromData } from './errorMessage';

export interface ChangeEmailConfirmResult {
  success: boolean;
  email?: string;
  codeValid?: boolean;
  attemptsLeft?: number;
  error?: string;
}

export async function changeEmailConfirm(
  newEmail: string,
  code: string
): Promise<ChangeEmailConfirmResult> {
  try {
    const response = await fetch(`${SERVER}/auth/change-email-confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + appState.accessToken,
      },
      body: JSON.stringify({ newEmail: newEmail.trim(), code }),
    });
    const data = await response.json();
    if (response.ok && data.success && data.email) {
      return { success: true, email: data.email };
    }
    return {
      success: false,
      codeValid: data.codeValid === false ? false : undefined,
      attemptsLeft: data.attemptsLeft,
      error: getErrorMessageFromData(data, 'Ошибка подтверждения email'),
    };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Ошибка сети';
    return { success: false, error: msg };
  }
}
