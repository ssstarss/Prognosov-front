/**
 * Форматирование ввода номера телефона (международный формат).
 * Допускает +, цифры, пробелы, скобки и дефисы; при сохранении нормализуется в E.164.
 */

const MAX_DIGITS_AFTER_PLUS = 15;

export function formatPhoneInput(value: string): string {
  let result = value.trim();
  if (!result) return '';

  const startsWithPlus = result.startsWith('+');
  const digits = result.replace(/\D/g, '');

  if (!startsWithPlus && digits.startsWith('8') && digits.length <= 11) {
    return `+7${digits.slice(1)}`;
  }

  result = result.replace(/[^\d+\s()-]/g, '');

  if (!result.startsWith('+')) {
    const limited = digits.slice(0, MAX_DIGITS_AFTER_PLUS);
    return limited ? `+${limited}` : '';
  }

  let digitCount = 0;
  let formatted = '+';
  for (const ch of result.slice(1)) {
    if (/\d/.test(ch)) {
      if (digitCount >= MAX_DIGITS_AFTER_PLUS) continue;
      digitCount += 1;
      formatted += ch;
    } else if (/[\s()-]/.test(ch)) {
      formatted += ch;
    }
  }

  return formatted;
}
