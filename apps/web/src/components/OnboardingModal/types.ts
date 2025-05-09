interface OnboardingStep {
  title: string;
  description: string;
  image?: string;
  video?: string;
}

interface OnboardingModalProps {
  steps: OnboardingStep[];
  isOpen: boolean;
  onClose: () => void;
}

export type { OnboardingStep, OnboardingModalProps };
