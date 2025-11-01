'use client';

import { useEffect, useState } from 'react';
import { OnboardingModal } from '@/components/OnboardingModal';
import { useTranslations } from 'next-intl';
import { usePostHog } from '@/hooks/usePostHog';

import { onboardingStepsData } from '@/data/onboardingSteps';

export const ONBOARDING_COMPLETED_EVENT = 'onboarding-completed';

export function OnboardingModalWrapper() {
  const t = useTranslations('Dashboard.onboarding.steps');
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { capture } = usePostHog();

  const onboardingSteps = onboardingStepsData.map(step => ({
    ...step,
    title: t(step.titleKey),
    description: t(step.descriptionKey),
  }));

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('onboarding') === 'completed';

    if (!hasSeenOnboarding) {
      setIsOpen(true);
      capture('onboarding_started', {
        is_first_visit: true,
      });
    }
  }, [capture]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('onboarding', 'completed');

    if (currentStep < onboardingSteps.length - 1) {
      capture('onboarding_skipped', {
        last_step_viewed: currentStep,
        total_steps: onboardingSteps.length,
      });
    } else {
      capture('onboarding_completed', {
        total_steps: onboardingSteps.length,
      });
    }

    const event = new CustomEvent(ONBOARDING_COMPLETED_EVENT);
    window.dispatchEvent(event);
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    capture('onboarding_step_viewed', {
      step_number: step + 1,
      step_title: onboardingSteps[step]?.title,
      total_steps: onboardingSteps.length,
    });
  };

  return (
    <OnboardingModal
      steps={onboardingSteps}
      isOpen={isOpen}
      onClose={handleClose}
      onStepChange={handleStepChange}
    />
  );
}
