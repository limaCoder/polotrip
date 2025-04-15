import { LocaleCurrencyEnum } from '@/constants/localesEnum';

const getCurrency = (locale: string) => {
  const currency = LocaleCurrencyEnum[locale as keyof typeof LocaleCurrencyEnum];

  return currency.toLowerCase();
};

export { getCurrency };
