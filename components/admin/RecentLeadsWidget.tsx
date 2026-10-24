"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { requireAuth } from "@/lib/firebase/requireAuth";
import { listRecentLeads } from "@/lib/data/leads";
import type { WithId, LeadDoc } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/admin/EmptyState";

type LoadState = "loading" | "loaded" | "error";

export function RecentLeadsWidget() {
  const [state, setState] = useState<LoadState>("loading");
  const [leads, setLeads] = useState<WithId<LeadDoc>[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(requireAuth(), (user) => {
      if (!user) return;
      listRecentLeads(5)
        .then((result) => {
          setLeads(result);
          setState("loaded");
        })
        .catch(() => setState("error"));
    });
    return unsubscribe;
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent leads</CardTitle>
      </CardHeader>
      <CardContent>
        {state === "loading" && <p className="text-sm text-muted-foreground">Loading…</p>}
        {state === "error" && <p className="text-sm text-destructive">Couldn&apos;t load leads. Refresh to try again.</p>}
        {state === "loaded" && leads.length === 0 && <EmptyState title="No leads yet" description="New enquiries from the Request a Quote form will show up here." />}
        {state === "loaded" && leads.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell className="text-muted-foreground">{lead.company}</TableCell>
                  <TableCell className="capitalize">{lead.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
