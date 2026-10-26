import { prepareImageForUpload } from "@/lib/storage/compressImage";

export interface UploadedAdminFile {
  url: string;
  contentType: string;
  sizeKb: number;
  /** Pixel size for images, 0 for PDFs. */
  width: number;
  height: number;
}

/**
 * Browser side of an admin upload: shrinks oversized photos, then sends the
 * file to /api/admin/uploads, which stores it in Firebase Storage. Throws
 * with a message the admin can act on when the upload is refused.
 */
export async function uploadAdminFile(file: File): Promise<UploadedAdminFile> {
  const prepared = await prepareImageForUpload(file);
  const body = new FormData();
  body.append("file", prepared.file);

  const res = await fetch("/api/admin/uploads", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Upload failed (${res.status}).`);
  }
  return { url: data.url, contentType: data.contentType, sizeKb: data.sizeKb, width: prepared.width, height: prepared.height };
}
