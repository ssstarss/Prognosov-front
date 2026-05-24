function bytesToBase64(bytes: number[]): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBytes(base64: string, maxBytes = 256): number[] {
  try {
    const cleanBase64 = base64.replace(/\s/g, '');
    const binary = atob(cleanBase64);
    const limit = Math.min(binary.length, maxBytes);
    const bytes: number[] = [];
    for (let i = 0; i < limit; i++) {
      bytes.push(binary.charCodeAt(i));
    }
    return bytes;
  } catch {
    return [];
  }
}

function detectImageMime(bytes: number[]): string {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return 'image/png';
  }
  if (
    bytes.length >= 6 &&
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38
  ) {
    return 'image/gif';
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'image/webp';
  }
  const asciiPrefix = String.fromCharCode(...bytes.slice(0, 256)).trimStart().toLowerCase();
  if (asciiPrefix.startsWith('<svg') || (asciiPrefix.startsWith('<?xml') && asciiPrefix.includes('<svg'))) {
    return 'image/svg+xml';
  }
  return 'image/png';
}

function bytesToDataUrl(bytes: number[]): string {
  return `data:${detectImageMime(bytes)};base64,${bytesToBase64(bytes)}`;
}

export default function avatarToDataUrl(avatar: unknown): string | null {
  if (!avatar) return null;

  if (typeof avatar === 'string') {
    const value = avatar.trim();
    if (!value) return null;
    if (value.startsWith('data:image/')) return value;

    // Иногда сервер присылает "сырой" base64 без префикса data URL.
    // Определяем mime по сигнатуре, чтобы браузер корректно декодировал изображение.
    const mime = detectImageMime(base64ToBytes(value));
    return `data:${mime};base64,${value}`;
  }

  if (avatar instanceof Uint8Array) {
    if (avatar.length === 0) return null;
    return bytesToDataUrl(Array.from(avatar));
  }

  if (Array.isArray(avatar)) {
    if (avatar.length === 0) return null;
    return bytesToDataUrl(avatar as number[]);
  }

  if (typeof avatar === 'object' && avatar !== null) {
    const maybeBuffer = avatar as { data?: number[] };
    if (Array.isArray(maybeBuffer.data) && maybeBuffer.data.length > 0) {
      return bytesToDataUrl(maybeBuffer.data);
    }

    // Prisma/JSON иногда приходит как объект вида {"0":255,"1":216,...}
    const entries = Object.entries(avatar as Record<string, unknown>);
    if (entries.length > 0 && entries.every(([k, v]) => /^\d+$/.test(k) && typeof v === 'number')) {
      const numericBytes = entries
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([, v]) => Number(v));
      return bytesToDataUrl(numericBytes);
    }
  }

  return null;
}
