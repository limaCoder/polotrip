import { PostHog } from 'posthog-node';

/**
 * PostHog client for server-side tracking
 * Useful for capturing events in Server Actions, API Routes, etc
 *
 * @example
 * ```typescript
 * import { PostHogClient } from '@/lib/posthog';
 *
 * const client = PostHogClient();
 * client.capture({
 *   distinctId: userId,
 *   event: 'album_created',
 *   properties: { album_id: albumId }
 * });
 * await client.shutdown();
 * ```
 */
export default function PostHogClient() {
  const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });

  return posthogClient;
}
