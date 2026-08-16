"use client";

import { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { requireAuth } from "@/lib/firebase/requireAuth";
import { getMediaLibrary } from "@/lib/data/media";
import type { WithId, MediaDoc } from "@/lib/types";

type LoadState = "loading" | "loaded" | "error";

/** Waits for the browser's Firebase Auth session to rehydrate (same reason as T6/T7's client-fetched admin screens), then loads the media index. */
export function useMediaLibrary() {
  const [items, setItems] = useState<WithId<MediaDoc>[]>([]);
  const [state, setState] = useState<LoadState>("loading");

  const refresh = useCallback(() => {
    setState("loading");
    getMediaLibrary()
      .then((result) => {
        setItems(result);
        setState("loaded");
      })
      .catch(() => setState("error"));
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(requireAuth(), (user) => {
      if (user) refresh();
    });
    return unsubscribe;
  }, [refresh]);

  return { items, state, refresh };
}
