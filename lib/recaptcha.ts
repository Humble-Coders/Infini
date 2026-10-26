import "server-only";

/**
 * Server-side reCAPTCHA v3 check for the contact form (CLAUDE.md rule 5).
 * Off until RECAPTCHA_SECRET_KEY is set, so local and preview builds work
 * without keys; once set, a missing or low-scoring token is refused.
 */
export async function verifyRecaptcha(token: string, ip: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5000),
    });
    const data = (await res.json()) as { success?: boolean; score?: number; action?: string };
    const minScore = Number(process.env.RECAPTCHA_MIN_SCORE) || 0.5;
    return Boolean(data.success) && data.action === "contact" && (data.score ?? 0) >= minScore;
  } catch (error) {
    // Google unreachable: let the enquiry through (rate limits and the honeypot still apply)
    // rather than turning real customers away.
    console.error("[recaptcha] verification unavailable:", (error as Error)?.message);
    return true;
  }
}
