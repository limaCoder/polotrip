const stepNumbers = [1, 2, 3, 4, 5] as const;
type StepNumber = (typeof stepNumbers)[number];

type CategoryKey = `step_${StepNumber}_category`;
type TitleKey = `step_${StepNumber}_title`;

type HowItWorksData = {
  categoryKey: CategoryKey;
  titleKey: TitleKey;
  src: string;
};

export type { HowItWorksData };
