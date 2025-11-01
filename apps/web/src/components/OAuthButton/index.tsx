'use client';

import { useState } from 'react';

import { Button } from '@/components/Button';
import { Loader2 } from 'lucide-react';

import { signIn } from '@/lib/auth/client';
import { env } from '@/lib/env';
import { OAuthButtonProps } from './types';
import { useParams } from 'next/navigation';
import { usePostHog } from '@/hooks/usePostHog';

export function OAuthButton({ provider, children, ...props }: OAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const locale = params?.locale as string;
  const { capture } = usePostHog();

  return (
    <Button
      type="button"
      className="border border-text-opacity-25 rounded-lg py-2 px-6 w-full font-normal justify-center items-center hover:bg-gray-50"
      onClick={async () => {
        setIsLoading(true);

        capture('sign_in_started', {
          provider,
          locale,
        });

        try {
          await signIn.social({
            provider,
            callbackURL: `${env.NEXT_PUBLIC_WEB_URL}/${locale}/dashboard`,
          });

          capture('sign_in_completed', {
            provider,
            locale,
          });
        } catch (error) {
          capture('sign_in_failed', {
            provider,
            locale,
            error_message: error instanceof Error ? error.message : 'Unknown error',
          });
          setIsLoading(false);
        }
      }}
      {...props}
    >
      {children}

      {isLoading ? <Loader2 className="size-5 animate-spin" /> : null}
    </Button>
  );
}
