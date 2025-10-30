import { format, parseISO } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { useTranslations } from 'next-intl';

const locales = {
  pt: ptBR,
  en: enUS,
};

/**
 * Converts a Date object to an ISO string for the API
 * Returns null when the date is null or undefined
 */
export const dateToAPIString = (date: Date | null | undefined): string | null =>
  date ? date.toISOString() : null;

/**
 * Converts an ISO date string from the API to a Date object
 * Returns null when the string is null or undefined
 */
export const apiStringToDate = (dateStr: string | null | undefined): Date | null =>
  dateStr ? new Date(dateStr) : null;

/**
 * Formats a date to display in the Brazilian format
 * Example: "Quinta-feira, 12 de janeiro"
 */
export const formatDateToDisplay = (
  dateString: string | null,
  locale: 'pt' | 'en',
  t: ReturnType<typeof useTranslations<'DatesUtils'>>,
): string => {
  if (!dateString) return t('no_date_defined');

  try {
    const date = parseISO(dateString);
    const formatString = locale === 'pt' ? "EEEE, dd 'de' MMMM" : 'EEEE, MMMM dd';
    return format(date, formatString, { locale: locales[locale] });
  } catch (error) {
    console.error('Error parsing date:', error);
    return dateString;
  }
};

/**
 * Formats a date to display in the short format
 * Example: "12/01/2023"
 */
export const formatDateShort = (
  date: Date | string | null | undefined,
  locale: 'pt' | 'en',
): string => {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const formatString = locale === 'pt' ? 'dd/MM/yyyy' : 'MM/dd/yyyy';
    return format(dateObj, formatString, { locale: locales[locale] });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};
