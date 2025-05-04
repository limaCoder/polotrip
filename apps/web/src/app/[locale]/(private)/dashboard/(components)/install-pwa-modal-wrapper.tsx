'use client';

import { useEffect, useState } from 'react';
import { InstallPwaModal } from '@/components/InstallPwaModal';
import { ONBOARDING_COMPLETED_EVENT } from './onboarding-modal-wrapper';

export function InstallPwaModalWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  const checkAndShowPwaModal = () => {
    const hasSeenPwaInstall = localStorage.getItem('pwa-install') === 'completed';

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      window.navigator.userAgent,
    );

    if (!hasSeenPwaInstall && isMobile) {
      setIsOpen(true);
    }
  };

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
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('pwa-install', 'completed');
  };

  return <InstallPwaModal isOpen={isOpen} onClose={handleClose} />;
}
