/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
/** biome-ignore-all lint/a11y/useSemanticElements: <explanation> */
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/cn";
import type { OnboardingModalProps } from "./types";

export function OnboardingModal({
  steps,
  isOpen,
  onClose,
  onStepChange,
}: OnboardingModalProps) {
  const t = useTranslations("Dashboard.onboarding");
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
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="overflow-hidden sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center p-6">
          <h2 className="mb-2 font-semibold text-xl">
            {steps[currentStep].title}
          </h2>
          <p className="mb-6 text-center text-muted-foreground">
            {steps[currentStep].description}
          </p>

          <div className="mb-6 flex space-x-2">
            {steps.map((_, index) => (
              <div
                aria-label={t("go_to_step_aria", { step: index + 1 })}
                className={cn(
                  "h-2 w-2 cursor-pointer rounded-full border border-secondary transition-all duration-300 hover:scale-125",
                  index === currentStep ? "bg-primary" : "bg-muted"
                )}
                key={index}
                onClick={() => handleStepChange(index)}
                role="button"
                tabIndex={0}
              />
            ))}
          </div>
        </div>
        <DialogFooter>
          <div className="flex w-full justify-between">
            <Button
              aria-label={t("back_button")}
              className="transition-all duration-700 hover:bg-secondary hover:text-white"
              disabled={isFirstStep}
              onClick={handlePrevious}
              variant="outline"
            >
              {t("back_button")}
            </Button>

            <Button
              aria-label={isLastStep ? t("start_button") : t("next_button")}
              className="text-white"
              onClick={handleNext}
            >
              {isLastStep ? t("start_button") : t("next_button")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
