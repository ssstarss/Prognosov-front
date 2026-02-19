/**
 * Форматирование и нормализация ввода номера телефона.
 * - Замена 8 на +7
 * - Только цифры после +
 * - Максимум 12 символов (формат +7XXXXXXXXXX)
 */

const MAX_PHONE_LENGTH = 12;

export function formatPhoneInput(value: string): string {
  let result = value.trim();

  if (result.length === 0) {
    return '';
  }

  // Если начинается с 8, заменяем на +7
  if (result.startsWith('8')) {
    result = '+7' + result.substring(1);
  }

  // Удаляем все символы кроме цифр и +
  result = result.replace(/[^\d+]/g, '');

  // Если начинается не с +, добавляем +
  if (!result.startsWith('+')) {
    if (result.length > 0 && /^\d/.test(result)) {
      result = '+' + result;
    }
  }

  // Проверяем, что после + только цифры
  if (result.length > 1) {
    const afterPlus = result.substring(1);
    const digitsAfterPlus = afterPlus.replace(/\D/g, '');
    result = '+' + digitsAfterPlus;
  }

  // Ограничиваем длину
  if (result.length > MAX_PHONE_LENGTH) {
    result = result.substring(0, MAX_PHONE_LENGTH);
  }

  return result;
}
