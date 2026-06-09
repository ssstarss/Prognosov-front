/**
 * Международный номер телефона (E.164).
 * Формат хранения: +<код страны><номер>, 8–15 цифр после +.
 */

export interface ValidatePhoneResult {
  valid: boolean;
  errorMessage: string;
  normalized?: string;
}

export const E164_PHONE_REGEX = /^\+[1-9]\d{7,14}$/;

export function normalizePhone(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const digitsOnly = trimmed.replace(/\D/g, '');

  if (!trimmed.startsWith('+') && digitsOnly.length === 11 && digitsOnly.startsWith('8')) {
    const candidate = `+7${digitsOnly.slice(1)}`;
    return E164_PHONE_REGEX.test(candidate) ? candidate : null;
  }

  const normalized = trimmed.startsWith('+')
    ? `+${trimmed.slice(1).replace(/\D/g, '')}`
    : `+${digitsOnly}`;

  return E164_PHONE_REGEX.test(normalized) ? normalized : null;
}

export function validatePhone(phoneValue: string): ValidatePhoneResult {
  if (!phoneValue.trim()) {
    return { valid: false, errorMessage: 'Телефон обязателен для заполнения' };
  }

  const trimmed = phoneValue.trim();

  if (trimmed.startsWith('+') && trimmed.replace(/\D/g, '').length < 2) {
    return { valid: false, errorMessage: '' };
  }

  const normalized = normalizePhone(phoneValue);
  if (!normalized) {
    return {
      valid: false,
      errorMessage: 'Укажите номер в международном формате, например +7… или +49…',
    };
  }

  return { valid: true, errorMessage: '', normalized };
}
