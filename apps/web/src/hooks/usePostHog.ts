'use client';

import { useCallback } from 'react';
import { usePostHog as usePHHook } from 'posthog-js/react';

/**
 * Hook to use PostHog with TypeScript safety
 * Provides typed methods for capture, identify and reset
 */
export const usePostHog = () => {
  const posthog = usePHHook();

  const capture = useCallback(
    (eventName: string, properties?: Record<string, unknown>) => {
      posthog?.capture(eventName, properties);
    },
    [posthog],
  );

  const identify = useCallback(
    (userId: string, properties?: Record<string, unknown>) => {
      posthog?.identify(userId, properties);
    },
    [posthog],
  );

  const reset = useCallback(() => {
    posthog?.reset();
  }, [posthog]);

  const setPersonProperties = useCallback(
    (properties: Record<string, unknown>) => {
      posthog?.people.set(properties);
    },
    [posthog],
  );

  const captureError = useCallback(
    (error: Error, context?: Record<string, unknown>) => {
      posthog?.capture('$exception', {
        $exception_message: error.message,
        $exception_type: error.name,
        $exception_stacktrace: error.stack,
        ...context,
      });
    },
    [posthog],
  );

  return { capture, identify, reset, setPersonProperties, captureError, posthog };
};
