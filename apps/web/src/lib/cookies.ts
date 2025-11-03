export function setCookie(name: string, value: string, expiresDate: Date) {
  if (typeof document === "undefined") return;
  // biome-ignore lint: this is a utility function specifically for cookie manipulation, document.cookie is the only way to set cookies in the browser
  document.cookie = `${name}=${value}; expires=${expiresDate.toUTCString()}; path=/`;
}
