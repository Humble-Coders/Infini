import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { requireStorage } from "@/lib/firebase/requireAuth";
import { prepareImageForUpload } from "@/lib/storage/compressImage";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_DOCUMENT_BYTES = 20 * 1024 * 1024;

export class MediaValidationError extends Error {}

function assertAcceptable(file: File) {
  const isImage = file.type.startsWith("image/");
  const isPdf = file.type === "application/pdf";
  if (!isImage && !isPdf) {
    throw new MediaValidationError(`"${file.name}" isn't an image or a PDF — only those are accepted.`);
  }
  const limit = isImage ? MAX_IMAGE_BYTES : MAX_DOCUMENT_BYTES;
  if (file.size > limit) {
    throw new MediaValidationError(`"${file.name}" is ${(file.size / 1024 / 1024).toFixed(1)}MB, over the ${limit / 1024 / 1024}MB limit.`);
  }
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export interface UploadedFile {
  url: string;
  path: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
  width: number;
  height: number;
}

/**
 * Compresses (images only), uploads to Storage under a flat media/ path
 * (matches backend/storage.rules' single-segment `media/{fileId}` match),
 * and resolves once the download URL is available. Storage rules re-enforce
 * the same size/type limits server-side — this client check exists so a
 * rejected file fails fast with a clear message instead of a slow round trip.
 */
export async function uploadMediaFile(file: File, onProgress?: (percent: number) => void): Promise<UploadedFile> {
  assertAcceptable(file);

  const { file: prepared, width, height } = await prepareImageForUpload(file);
  assertAcceptable(prepared);

  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${sanitizeFilename(prepared.name)}`;
  const storageRef = ref(requireStorage(), `media/${uniqueName}`);
  const task = uploadBytesResumable(storageRef, prepared, { contentType: prepared.type });

  await new Promise<void>((resolve, reject) => {
    task.on(
      "state_changed",
      (snapshot) => onProgress?.((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
      reject,
      () => resolve()
    );
  });

  const url = await getDownloadURL(storageRef);

  return {
    url,
    path: storageRef.fullPath,
    filename: prepared.name,
    contentType: prepared.type,
    sizeBytes: prepared.size,
    width,
    height,
  };
}

/** Removes the underlying Storage object — call after deleting the Firestore index doc, or the two can drift apart on partial failure. */
export async function deleteMediaFile(path: string): Promise<void> {
  await deleteObject(ref(requireStorage(), path));
}
