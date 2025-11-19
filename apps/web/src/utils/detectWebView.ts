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
 * Returns true if successful, false if user action is needed
 */
export function openInExternalBrowser(url: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  // Strategy 1: Try window.open (may be blocked in WebViews)
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");

  if (newWindow && !newWindow.closed) {
    return true;
  }

  // Strategy 2: Create a temporary link and simulate click
  // This sometimes works better in WebViews
  try {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Give it a moment to see if it worked
    setTimeout(() => {
      // If we're still here, it likely didn't work
    }, 100);

    return true;
  } catch {
    // Continue to next strategy
  }

  // Strategy 3: Try using location.replace (less likely to work)
  try {
    window.location.replace(url);
    return true;
  } catch {
    // Continue to fallback
  }

  // If all strategies fail, return false so UI can show instructions
  return false;
}
