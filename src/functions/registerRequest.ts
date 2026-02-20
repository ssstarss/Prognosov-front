import { SERVER } from '../constants';
import { RegisterFormData } from '../interfaces/interfaces';

export async function registerRequest(formData: RegisterFormData): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${SERVER}/auth/register-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.message || data || 'Ошибка регистрации' };
    }
    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Ошибка сети';
    return { success: false, error: msg };
  }
}
