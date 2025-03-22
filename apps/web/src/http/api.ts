import { env } from '@/lib/env';
import ky, { Options } from 'ky';
import { headers } from 'next/headers';

interface ApiResponse<T> {
  response: T;
}

const apiInstance = ky
  .create({
    prefixUrl: env.NEXT_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  .extend({
    hooks: {
      beforeRequest: [
        async request => {
          const header = await headers();

          const cookies = header.get('cookie');

          const sessionCookie = cookies?.split('; ').find(cookie => cookie.startsWith('polotrip'));

          request.headers.set('cookie', sessionCookie ?? '');
        },
      ],
    },
  });

export const api = {
  get: <T>(url: string, options?: Options) => apiInstance.get(url, options).json<ApiResponse<T>>(),

  post: <T>(url: string, options?: Options) =>
    apiInstance.post(url, options).json<ApiResponse<T>>(),

  put: <T>(url: string, options?: Options) => apiInstance.put(url, options).json<ApiResponse<T>>(),

  patch: <T>(url: string, options?: Options) =>
    apiInstance.patch(url, options).json<ApiResponse<T>>(),

  delete: <T>(url: string, options?: Options) =>
    apiInstance.delete(url, options).json<ApiResponse<T>>(),
};
