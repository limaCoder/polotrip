"use client";

import { usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth/client";

type User = {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  welcomeEmailSent?: boolean;
};

/**
 * PostHog user identification component (official Next.js App Router integration)
 * Ref: https://posthog.com/docs/product-analytics/identify
 */
export function PostHogIdentifier() {
  const posthog = usePostHog();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const session = await getSession();
      const userData = session?.data?.user ?? null;
      setUser(userData as User | null);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (user && posthog) {
      posthog.identify(user.id, {
        email: user.email,
        name: user.name,
        email_verified: user.emailVerified,
        avatar_url: user.image,
        created_at: user.createdAt,
      });
    } else if (!user && posthog) {
      posthog.reset();
    }
  }, [user, posthog]);

  return null;
}
