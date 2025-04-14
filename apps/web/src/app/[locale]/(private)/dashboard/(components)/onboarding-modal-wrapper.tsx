'use client';

import { useEffect, useState } from 'react';
import { OnboardingModal } from '@/components/OnboardingModal';
import { onboardingSteps } from '@/data/onboardingSteps';

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
  };

  return <OnboardingModal steps={onboardingSteps} isOpen={isOpen} onClose={handleClose} />;
}
