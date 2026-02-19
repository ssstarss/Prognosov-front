/**
 * Валидация номера телефона.
 * Формат: +7XXXXXXXXXX (12 символов, после + только цифры).
 */

export interface ValidatePhoneResult {
  valid: boolean;
  errorMessage: string;
}

export function validatePhone(phoneValue: string): ValidatePhoneResult {
  if (!phoneValue) {
    return { valid: false, errorMessage: 'Телефон обязателен для заполнения' };
  }

  // Проверяем, что телефон начинается с +7
  if (!phoneValue.startsWith('+7')) {
    // Если начинается с +, но еще не введена вторая цифра, не показываем ошибку (пользователь еще вводит)
    if (phoneValue.startsWith('+') && phoneValue.length < 3) {
      return { valid: false, errorMessage: '' };
    }
    return { valid: false, errorMessage: 'Телефон должен начинаться с +7' };
  }

  // Проверяем, что после + только цифры
  const afterPlus = phoneValue.substring(1);
  if (!/^\d+$/.test(afterPlus)) {
    return { valid: false, errorMessage: 'После + должны быть только цифры' };
  }

  // Проверяем длину: всего должно быть 12 символов (+7 и 10 цифр после +7)
  if (phoneValue.length !== 12) {
    return { valid: false, errorMessage: 'Телефон должен содержать 12 символов (формат: +7XXXXXXXXXX)' };
  }

  // Проверяем, что после +7 идет 10 цифр (всего 11 цифр после +)
  const digitsOnly = phoneValue.replace(/\D/g, '');
  if (digitsOnly.length !== 11) {
    return { valid: false, errorMessage: 'После +7 должно быть 10 цифр (формат: +7XXXXXXXXXX)' };
  }

  return { valid: true, errorMessage: '' };
}
