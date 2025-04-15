const LocaleTypesEnum = {
  PT: 'pt',
  EN: 'en',
} as const;

const LocaleFormatsEnum = {
  [LocaleTypesEnum.PT]: 'pt-BR',
  [LocaleTypesEnum.EN]: 'en-US',
} as const;

const LocaleCurrencyEnum = {
  [LocaleTypesEnum.PT]: 'BRL',
  [LocaleTypesEnum.EN]: 'USD',
} as const;

export { LocaleTypesEnum, LocaleFormatsEnum, LocaleCurrencyEnum };
