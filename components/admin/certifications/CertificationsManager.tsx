"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react";
import { requireAuth } from "@/lib/firebase/requireAuth";
import { getAllCertifications, deleteCertification, moveCertification, updateCertification } from "@/lib/data/certifications";
import type { CertificationDoc, WithId } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/admin/EmptyState";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { ExpiryBadge, daysUntilExpiry } from "@/components/admin/certifications/ExpiryBadge";
import { CertificationFormDialog } from "@/components/admin/certifications/CertificationFormDialog";

type LoadState = "loading" | "loaded" | "error";

export function CertificationsManager() {
  const [items, setItems] = useState<WithId<CertificationDoc>[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [editing, setEditing] = useState<WithId<CertificationDoc> | "new" | null>(null);
  // Captured once per fetch, not read fresh during render — Date.now() itself is impure and
  // the React Compiler flags calling it directly in a component body.
  const [loadedAt, setLoadedAt] = useState(() => Date.now());

  function refresh() {
    setState("loading");
    getAllCertifications()
      .then((result) => {
        setItems(result);
        setLoadedAt(Date.now());
        setState("loaded");
      })
      .catch(() => setState("error"));
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(requireAuth(), (user) => {
      if (user) refresh();
    });
    return unsubscribe;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={() => setEditing("new")}>
          <Plus className="size-4" aria-hidden="true" />
          Add certification
        </Button>
      </div>

      {state === "loading" && <p className="text-sm text-muted-foreground">Loading…</p>}
      {state === "error" && <p className="text-sm text-destructive">Couldn&apos;t load certifications. Refresh to try again.</p>}
      {state === "loaded" && items.length === 0 && (
        <EmptyState title="No certifications yet" description="Add INFINI's first certificate to get started." />
      )}
      {state === "loaded" && items.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Number</TableHead>
              <TableHead>Valid until</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((cert, index) => (
              <TableRow key={cert.id}>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={index === 0}
                      onClick={() => moveCertification(cert.id, "up").then(refresh)}
                      aria-label={`Move ${cert.name} up`}
                    >
                      <ChevronUp className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={index === items.length - 1}
                      onClick={() => moveCertification(cert.id, "down").then(refresh)}
                      aria-label={`Move ${cert.name} down`}
                    >
                      <ChevronDown className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{cert.name}</TableCell>
                <TableCell className="text-muted-foreground">{cert.certificateNumber}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span>{cert.validUntil.toDate().toLocaleDateString("en-IN")}</span>
                    <ExpiryBadge daysRemaining={daysUntilExpiry(cert.validUntil, loadedAt)} />
                  </div>
                </TableCell>
                <TableCell>
                  <PublishToggle
                    id={`cert-publish-${cert.id}`}
                    published={cert.published}
                    onChange={(next) => updateCertification(cert.id, { published: next }).then(refresh)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button type="button" variant="outline" size="sm" onClick={() => setEditing(cert)}>
                      <Pencil className="size-3.5" aria-hidden="true" />
                      Edit
                    </Button>
                    <DeleteConfirmDialog
                      trigger={
                        <Button type="button" variant="outline" size="sm">
                          <Trash2 className="size-3.5" aria-hidden="true" />
                          Delete
                        </Button>
                      }
                      title={`Delete "${cert.name}"?`}
                      description="This can't be undone. The certificate PDF and logo in Media are not deleted, only this listing."
                      onConfirm={() => deleteCertification(cert.id).then(refresh)}
                      successMessage="Certification deleted."
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <CertificationFormDialog
        key={editing === "new" ? "new" : (editing?.id ?? "closed")}
        certification={editing}
        onOpenChange={(open) => !open && setEditing(null)}
        onSaved={refresh}
      />
    </div>
  );
}
