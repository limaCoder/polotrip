const PricingEnum = {
  BASIC: 'basic',
  STANDARD: 'standard',
  PREMIUM: 'premium',
} as const;

const PHOTO_LIMITS = {
  [PricingEnum.BASIC]: 50,
  [PricingEnum.STANDARD]: 100,
  [PricingEnum.PREMIUM]: 150,
} as const;

type AlbumPlan = (typeof PricingEnum)[keyof typeof PricingEnum];

export { PricingEnum, PHOTO_LIMITS, type AlbumPlan };
