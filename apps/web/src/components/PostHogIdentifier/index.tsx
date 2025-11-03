"use client";

import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

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

type PostHogIdentifierProps = {
  user: User | null | undefined;
};

/**
 * PostHog user identification component (official Next.js App Router integration)
 * Ref: https://posthog.com/docs/product-analytics/identify
 */
export function PostHogIdentifier({ user }: PostHogIdentifierProps) {
  const posthog = usePostHog();

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
