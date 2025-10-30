'use client';

import { useEffect, useState } from 'react';
import { OnboardingModal } from '@/components/OnboardingModal';
import { useTranslations } from 'next-intl';

import { onboardingStepsData } from '@/data/onboardingSteps';

export const ONBOARDING_COMPLETED_EVENT = 'onboarding-completed';

export function OnboardingModalWrapper() {
  const t = useTranslations('Dashboard.onboarding.steps');
  const [isOpen, setIsOpen] = useState(false);

  const onboardingSteps = onboardingStepsData.map(step => ({
    ...step,
    title: t(step.titleKey),
    description: t(step.descriptionKey),
  }));

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
