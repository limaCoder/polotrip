import { useTranslations } from 'next-intl';

type Options = {
  value: string;
  label: string;
  flag: string;
  alt: string;
};

export const getOptions = (t: ReturnType<typeof useTranslations<'LocaleSwitcher'>>): Options[] => [
  { value: 'pt', label: 'Português', flag: '/flags/brazil.svg', alt: t('pt_br_alt') },
  { value: 'en', label: 'English', flag: '/flags/us.svg', alt: t('en_us_alt') },
];
