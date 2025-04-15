import { LocaleCurrencyEnum, LocaleFormatsEnum } from '@/constants/localesEnum';

const formatCurrency = (locale: string, value: number) => {
  const formattedLocale = LocaleFormatsEnum[locale as keyof typeof LocaleFormatsEnum];
  const currency = LocaleCurrencyEnum[locale as keyof typeof LocaleCurrencyEnum];

  return Intl.NumberFormat(formattedLocale, {
    style: 'currency',
    currency,
  }).format(value);
};

export { formatCurrency };
