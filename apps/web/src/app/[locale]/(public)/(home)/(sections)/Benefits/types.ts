const benefitNames = [
  "organized_memories",
  "interactive_map",
  "music_soundtrack",
  "no_space_limitations",
  "narrative_experience",
  "easy_sharing",
] as const;

type BenefitName = (typeof benefitNames)[number];
type TitleKey = `${BenefitName}_title`;
type DescriptionKey = `${BenefitName}_description`;

type BenefitData = {
  id: number;
  titleKey: TitleKey;
  descriptionKey: DescriptionKey;
  icon: React.ReactNode;
};

export type { BenefitData };
