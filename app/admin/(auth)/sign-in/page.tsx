"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlowingBorderCard } from "@/components/ui/glowing-border-card";
import {
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
} from "lucide-react";

type AuthMode = "signin" | "forgot-password";

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isDev = process.env.NODE_ENV === "development";

  async function handleLocalDevLogin() {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          devLogin: true,
          email: "admin@infini.co.in",
          role: "superAdmin",
        }),
      });
      if (!response.ok) throw new Error("Local session exchange failed");
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Local dev sign-in failed. Please check server.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignIn(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const cleanEmail = email.trim().toLowerCase();

    // Direct Secure Administrator Authentication via server session
    try {
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminLogin: true,
          email: cleanEmail,
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        router.push("/admin");
        router.refresh();
        return;
      }

      throw new Error(data.error || "Incorrect administrator email or password.");
    } catch (err: unknown) {
      setError((err as Error)?.message || "Sign-in failed. Please verify your credentials.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleForgotPassword(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError("Please enter your administrator email address.");
      return;
    }

    setSubmitting(true);
    try {
      // Process password reset via authenticated server endpoint
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Failed to process password reset request.");
      }

      setResetSent(true);
    } catch (err: unknown) {
      setError((err as Error)?.message || "Password reset request failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 overflow-hidden selection:bg-accent/30 selection:text-white">
      {/* Background ambient red glow aura */}
      <div className="absolute size-[480px] rounded-full bg-accent/15 blur-[140px] pointer-events-none transform -translate-y-12" />

      {/* Login Card with continuous running red glow laser beam */}
      <GlowingBorderCard className="max-w-md w-full" innerClassName="p-7 sm:p-9 space-y-6">
        {mode === "signin" ? (
          <>
            {/* Header */}
            <div className="space-y-1.5 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-accent/15 border border-accent/40 text-accent mb-3.5 shadow-[0_0_25px_rgba(242,53,64,0.35)]">
                <Shield className="size-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">INFINI Admin</h1>
              <p className="text-xs text-muted-foreground">Sign in to manage the website and operations.</p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Sign-in Form */}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Administrator Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border-border/70 bg-background/60 text-xs h-10 px-3.5 focus-visible:ring-accent"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot-password");
                      setError(null);
                    }}
                    className="text-[11px] text-accent/90 hover:text-accent hover:underline transition-colors font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl border-border/70 bg-background/60 text-xs h-10 pl-3.5 pr-10 focus-visible:ring-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl bg-accent text-accent-foreground font-semibold shadow-lg shadow-accent/25 hover:bg-accent/90 h-10 text-xs mt-2 transition-all"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    <span>Signing in...</span>
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>

              {isDev && (
                <div className="pt-2 border-t border-border/50">
                  <button
                    type="button"
                    onClick={handleLocalDevLogin}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 py-2 text-xs font-mono font-medium text-foreground hover:bg-muted transition-colors shadow-sm"
                  >
                    <KeyRound className="size-3.5 text-accent" />
                    <span>Quick Dev Sign-In (Local Bypass)</span>
                  </button>
                </div>
              )}
            </form>
          </>
        ) : (
          <>
            {/* Forgot Password Header */}
            <div className="space-y-1.5 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-accent/15 border border-accent/40 text-accent mb-3.5 shadow-[0_0_25px_rgba(242,53,64,0.35)]">
                <KeyRound className="size-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Reset Password</h1>
              <p className="text-xs text-muted-foreground">
                Enter your administrator email to receive a secure password reset link.
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {resetSent ? (
              /* Success State */
              <div className="space-y-5 py-2">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center space-y-2">
                  <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">Reset Link Dispatched</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    If <strong className="text-foreground">{email}</strong> is registered in the administrator registry, an authenticated password reset link has been dispatched. Please check your inbox and spam folder.
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setResetSent(false);
                    setError(null);
                  }}
                  className="w-full rounded-xl bg-accent text-accent-foreground font-semibold shadow-lg shadow-accent/25 hover:bg-accent/90 h-10 text-xs"
                >
                  Return to Sign In
                </Button>
              </div>
            ) : (
              /* Reset Request Form */
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="reset-email" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Administrator Email
                  </Label>
                  <Input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl border-border/70 bg-background/60 text-xs h-10 px-3.5 focus-visible:ring-accent"
                  />
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-card/40 p-2.5 text-[11px] text-muted-foreground">
                  <Lock className="size-3.5 text-accent shrink-0" />
                  <span>Restricted to authorized @infini.co.in administrator accounts.</span>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-xl bg-accent text-accent-foreground font-semibold shadow-lg shadow-accent/25 hover:bg-accent/90 h-10 text-xs mt-2 transition-all"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      <span>Sending reset link...</span>
                    </span>
                  ) : (
                    "Send Password Reset Link"
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setError(null);
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors pt-1"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </form>
            )}
          </>
        )}
      </GlowingBorderCard>
    </main>
  );
}
