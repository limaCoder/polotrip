import { auth } from "@polotrip/auth";
import { headers } from "next/headers";
import { cache } from "react";

export const getCurrentUser = cache(
  async () => (await auth.api.getSession({ headers: await headers() }))?.user
);
