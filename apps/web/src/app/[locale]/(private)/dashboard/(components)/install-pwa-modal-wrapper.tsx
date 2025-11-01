'use client';

import { useCallback, useEffect, useState } from 'react';
import { InstallPwaModal } from '@/components/InstallPwaModal';
import { ONBOARDING_COMPLETED_EVENT } from './onboarding-modal-wrapper';
import { usePostHog } from '@/hooks/usePostHog';

export function InstallPwaModalWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const { capture } = usePostHog();

  const checkAndShowPwaModal = useCallback(() => {
    const hasSeenPwaInstall = localStorage.getItem('pwa-install') === 'completed';

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      window.navigator.userAgent,
    );

    if (!hasSeenPwaInstall && isMobile) {
      setIsOpen(true);
      capture('pwa_install_prompt_shown', {
        device_type: /iPad|Tablet/i.test(window.navigator.userAgent) ? 'tablet' : 'mobile',
        user_agent: window.navigator.userAgent,
      });
    }
  }, [capture]);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('onboarding') === 'completed';

    if (hasSeenOnboarding) {
      checkAndShowPwaModal();
    }

    const handleOnboardingCompleted = () => {
      checkAndShowPwaModal();
    };

    window.addEventListener(ONBOARDING_COMPLETED_EVENT, handleOnboardingCompleted);

    return () => {
      window.removeEventListener(ONBOARDING_COMPLETED_EVENT, handleOnboardingCompleted);
    };
  }, [checkAndShowPwaModal]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('pwa-install', 'completed');

    capture('pwa_install_dismissed', {
      device_type: /iPad|Tablet/i.test(window.navigator.userAgent) ? 'tablet' : 'mobile',
    });
  };

  const handleInstall = () => {
    capture('pwa_install_accepted', {
      device_type: /iPad|Tablet/i.test(window.navigator.userAgent) ? 'tablet' : 'mobile',
    });
    handleClose();
  };

  return <InstallPwaModal isOpen={isOpen} onClose={handleClose} onInstall={handleInstall} />;
}
