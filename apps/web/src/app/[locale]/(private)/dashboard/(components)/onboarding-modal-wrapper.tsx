'use client';

import { useEffect, useState } from 'react';
import { OnboardingModal } from '@/components/OnboardingModal';
import { onboardingSteps } from '@/data/onboardingSteps';

export const ONBOARDING_COMPLETED_EVENT = 'onboarding-completed';

export function OnboardingModalWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('onboarding') === 'completed';

    if (!hasSeenOnboarding) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('onboarding', 'completed');

    const event = new CustomEvent(ONBOARDING_COMPLETED_EVENT);
    window.dispatchEvent(event);
  };

  return <OnboardingModal steps={onboardingSteps} isOpen={isOpen} onClose={handleClose} />;
}
