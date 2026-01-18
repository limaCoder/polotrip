import { format, parseISO } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import type { useTranslations } from "next-intl";

const locales = {
  pt: ptBR,
  en: enUS,
};

/**
 * Converts a Date object to an ISO string for the API
 * Returns null when the date is null or undefined
 */
export const dateToAPIString = (
  date: Date | null | undefined
): string | null => (date ? date.toISOString() : null);

/**
 * Converts an ISO date string from the API to a Date object
 * Returns null when the string is null or undefined
 */
export const apiStringToDate = (
  dateStr: string | null | undefined
): Date | null => (dateStr ? new Date(dateStr) : null);

/**
 * Formats a date to display in the Brazilian format
 * Example: "Quinta-feira, 12 de janeiro"
 */
export const formatDateToDisplay = (
  dateString: string | null,
  locale: "pt" | "en",
  t: ReturnType<typeof useTranslations<"DatesUtils">>
): string => {
  if (!dateString) return t("no_date_defined");

  try {
    const date = parseISO(dateString);
    const formatString =
      locale === "pt" ? "EEEE, dd 'de' MMMM" : "EEEE, MMMM dd";
    return format(date, formatString, { locale: locales[locale] });
  } catch (_error) {
    return dateString;
  }
};

/**
 * Formats a date to display in the short format
 * Example: "12/01/2023"
 */
export const formatDateShort = (
  date: Date | string | null | undefined,
  locale: "pt" | "en"
): string => {
  if (!date) return "";

  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    const formatString = locale === "pt" ? "dd/MM/yyyy" : "MM/dd/yyyy";
    return format(dateObj, formatString, { locale: locales[locale] });
  } catch (_error) {
    return "";
  }
};

/**
 * Formats a date to display in a human-readable format
 * Example (pt): "3 de abril de 2025"
 * Example (en): "April 3, 2025"
 */
export const formatDateReadable = (
  dateString: string | null | undefined,
  locale: "pt" | "en"
): string => {
  if (!dateString) return "";

  try {
    const date = parseISO(dateString);
    const formatString =
      locale === "pt" ? "d 'de' MMMM 'de' yyyy" : "MMMM d, yyyy";
    return format(date, formatString, { locale: locales[locale] });
  } catch (_error) {
    return dateString;
  }
};
