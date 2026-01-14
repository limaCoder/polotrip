import ky, { type Options } from "ky";
import { env } from "@/lib/env";

const isClient = typeof window !== "undefined";

const baseConfig = {
  prefixUrl: `${env.NEXT_PUBLIC_API_URL}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include" as RequestCredentials,
  timeout: 30_000,
  retry: {
    limit: 2,
    methods: ["get"],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
};

const clientApi = ky.create(baseConfig);

const serverApi = ky.create(baseConfig).extend({
  timeout: 60_000,
  hooks: {
    beforeRequest: [
      async (request) => {
        try {
          const { headers } = await import("next/headers");

          const header = await headers();

          const cookies = header.get("cookie");

          const sessionCookie = cookies
            ?.split("; ")
            .find((cookie) => cookie.startsWith("polotrip"));

          request.headers.set("cookie", sessionCookie ?? "");
        } catch (error) {
          throw new Error(`Error setting cookies: ${error}`);
        }
      },
    ],
  },
});

const apiInstance = isClient ? clientApi : serverApi;

export const api = {
  get: <T>(url: string, options?: Options) =>
    apiInstance.get(url, options).json<T>(),

  post: <T>(url: string, options?: Options) =>
    apiInstance.post(url, options).json<T>(),

  put: <T>(url: string, options?: Options) =>
    apiInstance.put(url, options).json<T>(),

  patch: <T>(url: string, options?: Options) =>
    apiInstance.patch(url, options).json<T>(),

  delete: <T>(url: string, options?: Options) =>
    apiInstance.delete(url, options).json<T>(),
};
