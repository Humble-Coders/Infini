declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
let loading: Promise<void> | null = null;

function loadScript(siteKey: string): Promise<void> {
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loading = null;
      reject(new Error("reCAPTCHA failed to load"));
    };
    document.head.appendChild(script);
  });
  return loading;
}

/**
 * A reCAPTCHA v3 token for `action`, or "" when no site key is configured.
 * The script loads on first use (the submit), so it costs nothing on page load.
 */
export async function getRecaptchaToken(action: string): Promise<string> {
  if (!SITE_KEY) return "";
  try {
    await loadScript(SITE_KEY);
    const grecaptcha = window.grecaptcha;
    if (!grecaptcha) return "";
    await new Promise<void>((resolve) => grecaptcha.ready(resolve));
    return await grecaptcha.execute(SITE_KEY, { action });
  } catch {
    // The server decides: with keys configured, a missing token is refused there.
    return "";
  }
}
