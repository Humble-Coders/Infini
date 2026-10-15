"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  type AuthError,
} from "firebase/auth";
import { requireAuth } from "@/lib/firebase/requireAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlowingBorderCard } from "@/components/ui/glowing-border-card";
import { Shield, KeyRound } from "lucide-react";

function friendlyAuthError(error: unknown): string {
  const code = (error as AuthError)?.code;
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Try again in a few minutes.";
    default:
      return "Sign-in failed. Please try again.";
  }
}

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
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
    setResetMessage(null);
    setSubmitting(true);

    // Local dev offline bypass: if developer enters admin credentials locally
    if (
      isDev &&
      (email === "admin@infini.co.in" || email.toLowerCase().includes("admin")) &&
      (password === "InfiniSuperAdmin2026!" || password.length >= 6)
    ) {
      try {
        const response = await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            devLogin: true,
            email: email || "admin@infini.co.in",
            role: "superAdmin",
          }),
        });
        if (response.ok) {
          router.push("/admin");
          router.refresh();
          return;
        }
      } catch {
        // Fall through to real Firebase attempt
      }
    }

    try {
      const credential = await signInWithEmailAndPassword(requireAuth(), email, password);
      const idToken = await credential.user.getIdToken();

      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!response.ok) throw new Error("session-exchange-failed");

      router.push("/admin");
      router.refresh();
    } catch (err) {
      // In local development, if Firebase credentials are unseeded or network is offline
      if (isDev && email && password) {
        await handleLocalDevLogin();
        return;
      }
      setError(friendlyAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleForgotPassword() {
    setError(null);
    setResetMessage(null);
    if (!email) {
      setError("Enter your email above first, then click Forgot password.");
      return;
    }
    try {
      await sendPasswordResetEmail(requireAuth(), email);
      setResetMessage("If that account exists, a password reset email is on its way.");
    } catch {
      setResetMessage("If that account exists, a password reset email is on its way.");
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 overflow-hidden">
      {/* Background ambient red glow aura */}
      <div className="absolute size-96 rounded-full bg-accent/15 blur-[120px] pointer-events-none" />

      {/* Login Card with running red glow border effect */}
      <GlowingBorderCard className="max-w-sm" innerClassName="p-8 space-y-6">
        <div className="space-y-1.5 text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-accent/15 border border-accent/30 text-accent mb-3 shadow-[0_0_20px_rgba(242,53,64,0.3)]">
            <Shield className="size-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">INFINI Admin</h1>
          <p className="text-xs text-muted-foreground">Sign in to manage the website.</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              required
              placeholder="name@infini.co.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border-border/70 bg-background/50 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border-border/70 bg-background/50 text-xs"
            />
          </div>

          {error && (
            <p role="alert" className="text-xs text-destructive font-medium">
              {error}
            </p>
          )}
          {resetMessage && (
            <p role="status" className="text-xs text-muted-foreground">
              {resetMessage}
            </p>
          )}

          <Button type="submit" className="w-full rounded-xl bg-accent text-accent-foreground font-semibold shadow-md shadow-accent/25 hover:bg-accent/90" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </Button>

          {isDev && (
            <div className="pt-2 border-t border-border/50">
              <button
                type="button"
                onClick={handleLocalDevLogin}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card/60 py-2 text-xs font-mono font-medium text-foreground hover:bg-muted transition-colors shadow-sm"
              >
                <KeyRound className="size-3.5 text-accent" />
                <span>Quick Dev Sign-In</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleForgotPassword}
            className="w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Forgot password?
          </button>
        </form>
      </GlowingBorderCard>
    </main>
  );
}
