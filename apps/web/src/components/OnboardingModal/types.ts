interface OnboardingStep {
  title: string;
  description: string;
  image: string;
}

interface OnboardingModalProps {
  steps: OnboardingStep[];
  isOpen: boolean;
  onClose: () => void;
}

export type { OnboardingStep, OnboardingModalProps };
