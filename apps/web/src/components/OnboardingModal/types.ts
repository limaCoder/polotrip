/* eslint-disable @typescript-eslint/no-unused-vars */

type OnboardingStep = {
  title: string;
  description: string;
  image?: string;
  video?: string;
};

const stepNumbers = [1, 2, 3, 4, 5] as const;
type StepNumber = (typeof stepNumbers)[number];

type TitleKey = `step_${StepNumber}_title`;
type DescriptionKey = `step_${StepNumber}_description`;

type OnboardingStepData = Omit<OnboardingStep, "title" | "description"> & {
  titleKey: TitleKey;
  descriptionKey: DescriptionKey;
};

type OnboardingModalProps = {
  steps: OnboardingStep[];
  isOpen: boolean;
  onClose: () => void;
  onStepChange?: (step: number) => void;
};

export type { OnboardingStep, OnboardingModalProps, OnboardingStepData };
