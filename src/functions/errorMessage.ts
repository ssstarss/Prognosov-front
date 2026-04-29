export const getErrorMessageFromData = (data: unknown, fallback = 'Ошибка запроса'): string => {
  if (typeof data === 'string') {
    const trimmed = data.trim();
    return trimmed || fallback;
  }

  if (data && typeof data === 'object') {
    const payload = data as Record<string, unknown>;
    if (typeof payload.message === 'string' && payload.message.trim()) {
      return payload.message.trim();
    }
    if (typeof payload.error === 'string' && payload.error.trim()) {
      return payload.error.trim();
    }
  }

  return fallback;
};

export const readErrorMessage = async (
  response: Response,
  fallback = 'Ошибка запроса'
): Promise<string> => {
  try {
    const data = await response.clone().json();
    return getErrorMessageFromData(data, fallback);
  } catch {
    try {
      const text = await response.text();
      return getErrorMessageFromData(text, fallback);
    } catch {
      return fallback;
    }
  }
};
