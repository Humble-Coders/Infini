"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { requireAuth } from "@/lib/firebase/requireAuth";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await signOut(requireAuth());
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/admin/sign-in");
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" onClick={handleSignOut} disabled={signingOut}>
      {signingOut ? "Signing out…" : "Sign out"}
    </Button>
  );
}
