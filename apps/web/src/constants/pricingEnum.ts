const PricingEnum = {
  BASIC: 'basic',
  STANDARD: 'standard',
  PREMIUM: 'premium',
} as const;

type AlbumPlan = (typeof PricingEnum)[keyof typeof PricingEnum];

export { PricingEnum, type AlbumPlan };
