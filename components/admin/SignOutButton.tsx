"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { requireAuth } from "@/lib/firebase/requireAuth";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut(requireAuth());
    } catch {}
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/admin/sign-in");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={signingOut}
      title="Sign out"
      aria-label="Sign out"
      className="flex size-8 items-center justify-center rounded-full border border-border/80 bg-card/60 text-muted-foreground transition-colors hover:border-accent/40 hover:bg-muted hover:text-foreground shrink-0 shadow-sm"
    >
      <LogOut className="size-3.5" />
    </button>
  );
}
