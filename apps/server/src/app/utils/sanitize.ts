import DOMPurify from 'isomorphic-dompurify';

const sanitizeNullable = (value: string | null | undefined): string | null | undefined => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return DOMPurify.sanitize(value);
};

const sanitizeNonNullable = (value: string | undefined): string | undefined => {
  if (value === undefined) return undefined;
  return DOMPurify.sanitize(value);
};

export { sanitizeNullable, sanitizeNonNullable };
