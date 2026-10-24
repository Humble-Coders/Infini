"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { requireAuth } from "@/lib/firebase/requireAuth";
import { getContentCounts, type ContentCounts } from "@/lib/data/contentCounts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LoadState = "loading" | "loaded" | "error";

const LABELS: Record<keyof ContentCounts, string> = {
  industries: "Industries",
  caseStudies: "Case Studies",
  certifications: "Certifications",
  news: "News",
  testimonials: "Testimonials",
  events: "Events",
};

export function ContentCountsWidget() {
  const [state, setState] = useState<LoadState>("loading");
  const [counts, setCounts] = useState<ContentCounts | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(requireAuth(), (user) => {
      if (!user) return;
      getContentCounts()
        .then((result) => {
          setCounts(result);
          setState("loaded");
        })
        .catch(() => setState("error"));
    });
    return unsubscribe;
  }, []);

  if (state === "error") {
    return <p className="text-sm text-destructive">Couldn&apos;t load content counts. Refresh to try again.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {(Object.keys(LABELS) as (keyof ContentCounts)[]).map((key) => (
        <Card key={key}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{LABELS[key]}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">{state === "loading" ? "…" : counts?.[key]}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
