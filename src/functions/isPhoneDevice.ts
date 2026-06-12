function isTabletDevice(): boolean {
  if (typeof navigator === 'undefined') return false;

  const ua = navigator.userAgent;
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua)) {
    return true;
  }

  // iPadOS 13+ часто маскируется под Mac.
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
}

/** Телефон, но не планшет и не ноутбук. */
export function isPhoneDevice(): boolean {
  if (typeof window === 'undefined') return false;
  if (isTabletDevice()) return false;

  const ua = navigator.userAgent;
  if (/iphone|ipod|android.*mobile|windows phone|blackberry/i.test(ua)) {
    return true;
  }

  const touch = window.matchMedia('(pointer: coarse)').matches;
  const narrowPortrait = window.matchMedia('(max-width: 767px)').matches;
  const landscapePhone = window.matchMedia('(orientation: landscape) and (max-height: 520px)').matches;

  return touch && (narrowPortrait || landscapePhone);
}
