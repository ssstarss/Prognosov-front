import { SERVER } from '../constants';
import { notifyError } from '../Components/common/notifications/notificationBus';
import { apiFetch } from './apiClient';
import { readErrorMessage } from './errorMessage';

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiRequestOptions {
  /** Путь после SERVER, например `/teams?type=club` */
  host: string;
  method: ApiMethod;
  body?: unknown;
  errorMessage: string;
  /** true — notify и пробросить ошибку; false — notify, залогировать, вернуть undefined */
  rethrow?: boolean;
  /** false — не показывать toast (как старый updateGameHandle) */
  notify?: boolean;
}

export interface ApiRequestResult<T> {
  status: number;
  data: T;
}

const jsonHeaders = {
  Accept: 'application/json',
  'Content-type': 'application/json',
};

/**
 * Общий JSON-запрос к API: apiFetch (Bearer + refresh при 401), разбор ответа и ошибок.
 * Authorization задаётся только в apiFetch.
 */
export async function apiRequest<T = unknown>(
  options: ApiRequestOptions
): Promise<ApiRequestResult<T> | undefined> {
  const { host, method, body, errorMessage, rethrow = false, notify = true } = options;

  const init: RequestInit = {
    method,
    headers: jsonHeaders,
  };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  try {
    const response = await apiFetch(SERVER + host, init);
    if (!response.ok) {
      const message = await readErrorMessage(response, errorMessage);
      throw new Error(message);
    }
    const data = (await response.json()) as T;
    return { status: response.status, data };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : errorMessage;
    if (notify) notifyError(message);
    if (rethrow) {
      console.error(message);
      throw e;
    }
    console.log(message);
    return undefined;
  }
}
