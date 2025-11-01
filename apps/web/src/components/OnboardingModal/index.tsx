'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { OnboardingModalProps } from './types';
import { useTranslations } from 'next-intl';

export function OnboardingModal({ steps, isOpen, onClose, onStepChange }: OnboardingModalProps) {
  const t = useTranslations('Dashboard.onboarding');
  const [currentStep, setCurrentStep] = useState(0);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleStepChange = (newStep: number) => {
    setCurrentStep(newStep);
    onStepChange?.(newStep);
  };

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      handleStepChange(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    const newStep = Math.max(0, currentStep - 1);
    handleStepChange(newStep);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center p-6">
          <h2 className="text-xl font-semibold mb-2">{steps[currentStep].title}</h2>
          <p className="text-center text-muted-foreground mb-6">{steps[currentStep].description}</p>

          <div className="flex space-x-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'h-2 w-2 rounded-full border-secondary border cursor-pointer transition-all duration-300 hover:scale-125',
                  index === currentStep ? 'bg-primary' : 'bg-muted',
                )}
                onClick={() => handleStepChange(index)}
                role="button"
                tabIndex={0}
                aria-label={t('go_to_step_aria', { step: index + 1 })}
              />
            ))}
          </div>
        </div>
        <DialogFooter>
          <div className="flex w-full justify-between">
            <Button
              className="hover:bg-secondary hover:text-white transition-all duration-700"
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep}
              aria-label={t('back_button')}
            >
              {t('back_button')}
            </Button>

            <Button
              className="text-white"
              onClick={handleNext}
              aria-label={isLastStep ? t('start_button') : t('next_button')}
            >
              {isLastStep ? t('start_button') : t('next_button')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
