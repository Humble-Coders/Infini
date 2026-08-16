"use client";

import { useState } from "react";
import Image from "next/image";
import { Timestamp } from "firebase/firestore";
import { FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/admin/FieldError";
import { FormActions } from "@/components/admin/FormActions";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { createCertification, updateCertification } from "@/lib/data/certifications";
import type { CertificationDoc, WithId } from "@/lib/types";

function toDateInputValue(timestamp: { toDate(): Date } | undefined): string {
  if (!timestamp) return "";
  return timestamp.toDate().toISOString().slice(0, 10);
}

// Caller must remount with `key={certification?.id ?? "new"}` when the
// target changes, so local state seeds fresh per item/creation rather than
// an effect racing a user's in-progress edit.
export function CertificationFormDialog({
  certification,
  onOpenChange,
  onSaved,
}: {
  certification: WithId<CertificationDoc> | null | "new";
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}) {
  const editing = certification !== null && certification !== "new";
  const [name, setName] = useState(editing ? certification.name : "");
  const [certificateNumber, setCertificateNumber] = useState(editing ? certification.certificateNumber : "");
  const [issuedDate, setIssuedDate] = useState(editing ? toDateInputValue(certification.issuedDate) : "");
  const [validUntil, setValidUntil] = useState(editing ? toDateInputValue(certification.validUntil) : "");
  const [description, setDescription] = useState(editing ? certification.description : "");
  const [logoUrl, setLogoUrl] = useState(editing ? certification.logoUrl : "");
  const [fileUrl, setFileUrl] = useState(editing ? certification.fileUrl : "");
  const [published, setPublished] = useState(editing ? certification.published : false);
  const [nameError, setNameError] = useState<string | null>(null);

  async function handleSave() {
    if (!name.trim()) {
      setNameError("Name is required.");
      throw new Error("Name is required.");
    }
    if (!issuedDate || !validUntil) {
      throw new Error("Issued date and valid-until date are both required.");
    }
    setNameError(null);

    const data = {
      name,
      certificateNumber,
      description,
      logoUrl,
      fileUrl,
      issuedDate: Timestamp.fromDate(new Date(issuedDate)),
      validUntil: Timestamp.fromDate(new Date(validUntil)),
      published,
    };

    if (editing) {
      await updateCertification(certification.id, data);
    } else {
      await createCertification(data);
    }
    onSaved();
    onOpenChange(false);
  }

  return (
    <Dialog open={certification !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit certification" : "Add certification"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cert-name">Name</Label>
            <Input id="cert-name" value={name} onChange={(e) => setName(e.target.value)} required />
            <FieldError message={nameError ?? undefined} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cert-number">Certificate number</Label>
              <Input id="cert-number" value={certificateNumber} onChange={(e) => setCertificateNumber(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="cert-issued">Issued</Label>
                <Input id="cert-issued" type="date" value={issuedDate} onChange={(e) => setIssuedDate(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cert-valid-until">Valid until</Label>
                <Input id="cert-valid-until" type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} required />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cert-description">Description</Label>
            <Textarea id="cert-description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Logo</Label>
              <div className="flex items-center gap-3">
                {logoUrl ? (
                  <Image src={logoUrl} alt="" width={40} height={40} className="rounded border border-border object-contain" />
                ) : (
                  <span className="flex size-10 items-center justify-center rounded border border-dashed border-border text-xs text-muted-foreground">
                    None
                  </span>
                )}
                <MediaPicker
                  accept="image"
                  trigger={
                    <Button type="button" variant="outline" size="sm">
                      Choose logo
                    </Button>
                  }
                  onSelect={(media) => setLogoUrl(media.url)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Certificate PDF</Label>
              <div className="flex items-center gap-3">
                {fileUrl ? (
                  <FileText className="size-6 text-muted-foreground" aria-hidden="true" />
                ) : (
                  <span className="flex size-10 items-center justify-center rounded border border-dashed border-border text-xs text-muted-foreground">
                    None
                  </span>
                )}
                <MediaPicker
                  accept="pdf"
                  trigger={
                    <Button type="button" variant="outline" size="sm">
                      Choose PDF
                    </Button>
                  }
                  onSelect={(media) => setFileUrl(media.url)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="cert-published"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="size-4"
            />
            <Label htmlFor="cert-published">Published</Label>
          </div>
        </div>

        <FormActions onSave={handleSave} onCancel={() => onOpenChange(false)} successMessage={editing ? "Certification updated." : "Certification added."} />
      </DialogContent>
    </Dialog>
  );
}
