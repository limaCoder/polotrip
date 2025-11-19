// Regex patterns defined at top level for performance
const MOBILE_USER_AGENT_REGEX =
  /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
const KNOWN_BROWSER_REGEX = /chrome|safari|firefox|edge/i;

/**
 * Detects if the current environment is a WebView (in-app browser)
 * used by social media apps like LinkedIn, Facebook, Instagram, Reddit, etc.
 */
export function isWebView(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const userAgent = window.navigator.userAgent.toLowerCase();

  // Common WebView patterns from social media apps
  const webViewPatterns = [
    "linkedinapp", // LinkedIn
    "fban", // Facebook
    "fbav", // Facebook
    "instagram", // Instagram
    "line", // LINE
    "twitter", // Twitter
    "whatsapp", // WhatsApp
    "reddit", // Reddit
    "wv", // Generic WebView indicator
  ];

  // Check if user agent contains WebView indicators
  const isWebViewUserAgent = webViewPatterns.some((pattern) =>
    userAgent.includes(pattern)
  );

  // Additional check: if it's mobile but not a recognized browser
  const isMobile = MOBILE_USER_AGENT_REGEX.test(userAgent);
  const isKnownBrowser = KNOWN_BROWSER_REGEX.test(userAgent);

  // If mobile but not a known browser, likely WebView
  return isWebViewUserAgent || (isMobile && !isKnownBrowser);
}

/**
 * Opens a URL in an external browser
 * Works on both iOS and Android
 */
export function openInExternalBrowser(url: string): void {
  if (typeof window === "undefined") {
    return;
  }

  // Try to open in external browser
  // On iOS, this will prompt user to open in Safari
  // On Android, this will open in default browser
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");

  // If window.open was blocked or failed, try alternative method
  if (
    !newWindow ||
    newWindow.closed ||
    typeof newWindow.closed === "undefined"
  ) {
    // Fallback: try to redirect the current window
    // This will at least get the user out of the WebView
    window.location.href = url;
  }
}
