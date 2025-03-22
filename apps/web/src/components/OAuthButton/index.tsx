'use client';

import { useState } from 'react';

import { Button } from '@/components/Button';
import { Loader2 } from 'lucide-react';

import { signIn } from '@/lib/auth/client';
import { env } from '@/lib/env';
import { OAuthButtonProps } from './types';
import { useParams } from 'next/navigation';

export function OAuthButton({ provider, children, ...props }: OAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const locale = params.locale;

  return (
    <Button
      className="border border-text-opacity-25 rounded-lg py-2 px-6 w-full font-normal justify-center items-center hover:bg-gray-50"
      onClick={async () => {
        setIsLoading(true);

        await signIn.social({
          provider,
          callbackURL: `${env.NEXT_PUBLIC_WEB_URL}/${locale}/dashboard`,
        });
      }}
      {...props}
    >
      {children}

      {isLoading ? <Loader2 className="size-5 animate-spin" /> : null}
    </Button>
  );
}
