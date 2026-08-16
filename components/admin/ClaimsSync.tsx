"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { requireDb } from "@/lib/data/firestore";
import { requireAuth } from "@/lib/firebase/requireAuth";
import type { Role } from "@/lib/types";

/**
 * Watches the signed-in admin's own users/{uid} doc. If a Super Admin
 * changes this user's role or active flag elsewhere, this picks it up,
 * forces a fresh ID token (which carries the new custom claim), re-mints
 * the session cookie, and refreshes the page — so the change takes effect
 * without the user working out they need to sign out and back in.
 */
export function ClaimsSync({ uid, role }: { uid: string; role: Role }) {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(requireDb(), "users", uid), async (snap) => {
      const data = snap.data();
      if (!data) return;

      if (data.active === false) {
        await fetch("/api/auth/session", { method: "DELETE" });
        router.push("/admin/sign-in");
        return;
      }

      if (data.role !== role) {
        const user = requireAuth().currentUser;
        if (!user) return;
        const idToken = await user.getIdToken(true);
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });
        router.refresh();
      }
    });

    return unsubscribe;
  }, [uid, role, router]);

  return null;
}
