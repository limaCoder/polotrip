import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
export const formatDateToDisplay = (dateString: string | null): string => {
  if (!dateString) return 'Sem data definida';

  try {
    const date = parseISO(dateString);
    return format(date, "EEEE, dd 'de' MMMM", { locale: ptBR });
  } catch (error) {
    console.error('Error parsing date:', error);
    return dateString;
  }
};

/**
 * Formats a date to display in the short format
 * Example: "12/01/2023"
 */
export const formatDateShort = (date: Date | string | null | undefined): string => {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};
