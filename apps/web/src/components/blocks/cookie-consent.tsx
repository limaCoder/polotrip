'use client';

import * as React from 'react';
import { Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/cn';
import { useTranslations } from 'next-intl';
import posthog from 'posthog-js';

interface CookieConsentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'small' | 'mini';
  demo?: boolean;
  onAcceptCallback?: () => void;
  onDeclineCallback?: () => void;
  description?: string;
  learnMoreHref?: string;
}

const CookieConsent = React.forwardRef<HTMLDivElement, CookieConsentProps>(
  (
    {
      variant = 'default',
      demo = false,
      onAcceptCallback = () => {},
      onDeclineCallback = () => {},
      className,
      description,
      learnMoreHref,
      ...props
    },
    ref,
  ) => {
    const t = useTranslations('CookieConsent');
    const [isOpen, setIsOpen] = React.useState(false);
    const [hide, setHide] = React.useState(false);

    const finalDescription = description || t('description');
    const finalLearnMoreHref = learnMoreHref || '/privacy-policy';

    const handleAccept = React.useCallback(() => {
      setIsOpen(false);
      document.cookie = 'cookieConsent=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/';
      localStorage.setItem('posthog_opt_out', 'false');

      if (typeof posthog !== 'undefined' && posthog) {
        posthog.opt_in_capturing();
      }

      setTimeout(() => {
        setHide(true);
      }, 700);
      onAcceptCallback();
    }, [onAcceptCallback]);

    const handleDecline = React.useCallback(() => {
      setIsOpen(false);
      document.cookie = 'cookieConsent=declined; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/';
      localStorage.setItem('posthog_opt_out', 'true');

      if (typeof posthog !== 'undefined' && posthog) {
        posthog.opt_out_capturing();
        posthog.reset();
      }

      setTimeout(() => {
        setHide(true);
      }, 700);
      onDeclineCallback();
    }, [onDeclineCallback]);

    React.useEffect(() => {
      try {
        const hasConsent = document.cookie.includes('cookieConsent=true');
        const hasDeclined = document.cookie.includes('cookieConsent=declined');

        if ((hasConsent || hasDeclined) && !demo) {
          setIsOpen(false);
          setTimeout(() => {
            setHide(true);
          }, 700);

          // Sync PostHog opt-out status based on cookie
          if (hasDeclined) {
            localStorage.setItem('posthog_opt_out', 'true');
            if (typeof posthog !== 'undefined' && posthog) {
              posthog.opt_out_capturing();
            }
          } else if (hasConsent) {
            localStorage.setItem('posthog_opt_out', 'false');
            if (typeof posthog !== 'undefined' && posthog) {
              posthog.opt_in_capturing();
            }
          }
        } else {
          setIsOpen(true);
        }
      } catch (error) {
        console.warn('Cookie consent error:', error);
      }
    }, [demo]);

    if (hide) return null;

    const containerClasses = cn(
      'fixed z-50 transition-all duration-700',
      !isOpen ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100',
      className,
    );

    const commonWrapperProps = {
      ref,
      className: cn(
        containerClasses,
        variant === 'mini'
          ? 'left-0 right-0 sm:left-4 bottom-4 w-full sm:max-w-3xl'
          : 'bottom-0 left-0 right-0 sm:left-4 sm:bottom-4 w-full sm:max-w-md',
      ),
      ...props,
    };

    if (variant === 'default') {
      return (
        <div {...commonWrapperProps}>
          <Card className="m-3 shadow-lg bg-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">{t('title')}</CardTitle>
              <Cookie className="h-5 w-5" />
            </CardHeader>
            <CardContent className="space-y-2">
              <CardDescription className="text-sm">{finalDescription}</CardDescription>
              <p className="text-xs text-muted-foreground">{t('by_accepting')}</p>
              <a
                href={finalLearnMoreHref}
                className="text-xs text-primary underline underline-offset-4 hover:no-underline"
              >
                {t('learn_more')}
              </a>
            </CardContent>
            <CardFooter className="flex gap-2 pt-2">
              <Button onClick={handleDecline} className="flex-1 bg-yellow hover:bg-yellow/80">
                {t('decline_button')}
              </Button>
              <Button onClick={handleAccept} className="flex-1 text-white">
                {t('accept_button')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    if (variant === 'small') {
      return (
        <div {...commonWrapperProps}>
          <Card className="m-3 shadow-lg bg-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 h-0 px-4">
              <CardTitle className="text-base">{t('title')}</CardTitle>
              <Cookie className="h-4 w-4" />
            </CardHeader>
            <CardContent className="pt-0 pb-2 px-4">
              <CardDescription className="text-sm">{finalDescription}</CardDescription>
            </CardContent>
            <CardFooter className="flex gap-2 h-0 py-2 px-4">
              <Button
                onClick={handleDecline}
                size="sm"
                className="flex-1 rounded-full bg-yellow hover:bg-yellow/80"
              >
                {t('decline_button')}
              </Button>
              <Button onClick={handleAccept} size="sm" className="flex-1 rounded-full text-white">
                {t('accept_button')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    if (variant === 'mini') {
      return (
        <div {...commonWrapperProps}>
          <Card className="mx-3 p-0 py-3 shadow-lg bg-background">
            <CardContent className="sm:flex grid gap-4 p-0 px-3.5">
              <CardDescription className="text-xs sm:text-sm flex-1">
                {finalDescription}
              </CardDescription>
              <div className="flex items-center gap-2 justify-end sm:gap-3">
                <Button
                  onClick={handleDecline}
                  size="sm"
                  className="text-xs h-7 bg-yellow hover:bg-yellow/80"
                >
                  {t('decline_button')}
                  <span className="sr-only sm:hidden">{t('decline_button')}</span>
                </Button>
                <Button onClick={handleAccept} size="sm" className="text-xs h-7 text-white">
                  {t('accept_button')}
                  <span className="sr-only sm:hidden">{t('accept_button')}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return null;
  },
);

CookieConsent.displayName = 'CookieConsent';
export { CookieConsent };
export default CookieConsent;
