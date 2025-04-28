'use client';

import { useState } from 'react';
import Image from 'next/image';
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

export function OnboardingModal({ steps, isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Bem vindo ao Polotrip</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center p-6">
          <div className="relative w-full h-48 md:h-64 mb-6">
            <Image
              src={steps[currentStep].image || '/placeholder.svg'}
              alt={steps[currentStep].title}
              fill
              className="object-contain"
              priority
            />
          </div>

          <h2 className="text-xl font-semibold mb-2">{steps[currentStep].title}</h2>
          <p className="text-center text-muted-foreground mb-6">{steps[currentStep].description}</p>

          <div className="flex space-x-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'h-2 w-2 rounded-full',
                  index === currentStep ? 'bg-primary' : 'bg-muted',
                )}
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
              aria-label="Voltar"
            >
              Voltar
            </Button>

            <Button className="text-white" onClick={handleNext} aria-label="Próximo">
              {isLastStep ? 'Começar' : 'Próximo'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
