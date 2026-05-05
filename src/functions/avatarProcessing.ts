export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
    reader.readAsDataURL(file);
  });
}

export function toBase64Payload(dataUrl: string | null): string | null {
  if (!dataUrl) return null;
  const marker = ';base64,';
  const markerIndex = dataUrl.indexOf(marker);
  if (markerIndex === -1) return dataUrl;
  return dataUrl.slice(markerIndex + marker.length);
}

export function cropAndResizeAvatar(
  dataUrl: string,
  options?: { maxSide?: number; outputMime?: 'image/png' | 'image/jpeg'; quality?: number }
): Promise<string> {
  const maxSide = options?.maxSide ?? 256;
  const outputMime = options?.outputMime ?? 'image/png';
  const quality = options?.quality ?? 0.9;

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const side = Math.min(image.width, image.height);
      const sx = Math.floor((image.width - side) / 2);
      const sy = Math.floor((image.height - side) / 2);

      const targetSide = Math.max(1, Math.round(Math.min(maxSide, side)));
      const canvas = document.createElement('canvas');
      canvas.width = targetSide;
      canvas.height = targetSide;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Не удалось обработать изображение'));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(image, sx, sy, side, side, 0, 0, targetSide, targetSide);

      if (outputMime === 'image/jpeg') resolve(canvas.toDataURL(outputMime, quality));
      else resolve(canvas.toDataURL(outputMime));
    };
    image.onerror = () => reject(new Error('Не удалось обработать изображение'));
    image.src = dataUrl;
  });
}

export function fitAndResizeAvatar(
  dataUrl: string,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    outputMime?: 'image/png' | 'image/jpeg';
    quality?: number;
    backgroundColor?: string;
  }
): Promise<string> {
  const maxWidth = options?.maxWidth ?? 256;
  const maxHeight = options?.maxHeight ?? 256;
  const outputMime = options?.outputMime ?? 'image/png';
  const quality = options?.quality ?? 0.9;
  const backgroundColor = options?.backgroundColor ?? '#ffffff';

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
      const targetWidth = Math.max(1, Math.round(image.width * scale));
      const targetHeight = Math.max(1, Math.round(image.height * scale));

      const canvas = document.createElement('canvas');
      canvas.width = maxWidth;
      canvas.height = maxHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Не удалось обработать изображение'));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, maxWidth, maxHeight);

      const dx = Math.floor((maxWidth - targetWidth) / 2);
      const dy = Math.floor((maxHeight - targetHeight) / 2);
      ctx.drawImage(image, dx, dy, targetWidth, targetHeight);

      if (outputMime === 'image/jpeg') resolve(canvas.toDataURL(outputMime, quality));
      else resolve(canvas.toDataURL(outputMime));
    };
    image.onerror = () => reject(new Error('Не удалось обработать изображение'));
    image.src = dataUrl;
  });
}
