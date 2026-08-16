/**
 * Client-side only (uses the DOM canvas/Image APIs) — resizes an oversized
 * photo down to a sensible maximum dimension and re-encodes it as JPEG
 * before it ever reaches Storage. Non-image files (PDFs) and images already
 * under the limit pass through untouched. Returns the (possibly resized)
 * file alongside its pixel dimensions in one pass, since both need the same
 * decode step.
 */
const MAX_DIMENSION = 2000;
const JPEG_QUALITY = 0.82;

export interface PreparedImage {
  file: File;
  width: number;
  height: number;
}

export async function prepareImageForUpload(file: File): Promise<PreparedImage> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return { file, width: 0, height: 0 };
  }

  const bitmap = await createImageBitmap(file);
  const originalDimensions = { width: bitmap.width, height: bitmap.height };
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));

  // Already within bounds and not enormous — don't burn a re-encode for nothing.
  if (scale === 1 && file.size < 2 * 1024 * 1024) {
    bitmap.close();
    return { file, ...originalDimensions };
  }

  const targetWidth = Math.round(bitmap.width * scale);
  const targetHeight = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return { file, ...originalDimensions };
  }
  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
  if (!blob || blob.size >= file.size) {
    // Compression didn't help (or failed) — keep the original bytes and
    // report ITS dimensions, not the (unused) resized canvas's.
    return { file, ...originalDimensions };
  }

  const newName = file.name.replace(/\.\w+$/, "") + ".jpg";
  return { file: new File([blob], newName, { type: "image/jpeg" }), width: targetWidth, height: targetHeight };
}
