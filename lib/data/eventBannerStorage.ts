import fs from "fs";
import path from "path";

export interface EventBannerConfig {
  enabled: boolean;
  badge: string;
  title: string;
  location: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  startDate: string;
  endDate: string;
  theme: "red" | "dark" | "gold";
}

export const DEFAULT_BANNER_CONFIG: EventBannerConfig = {
  enabled: true,
  badge: "Upcoming Exhibition",
  title: "EMO Hannover 2026",
  location: "Hannover, Germany (Hall 11, Booth D32)",
  subtitle: "Visit INFINI at Hall 11, Booth D32 for live MMP precision surface finishing demonstrations",
  ctaText: "Schedule Technical Meeting",
  ctaUrl: "/contact",
  startDate: "2026-09-18",
  endDate: "2026-09-23",
  theme: "red",
};

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "eventBanner.json");

function readFallbackFile(): EventBannerConfig | null {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const raw = fs.readFileSync(FILE_PATH, "utf-8");
      return JSON.parse(raw) as EventBannerConfig;
    }
  } catch (err) {
    console.warn("[eventBannerStorage] Failed to read fallback file:", err);
  }
  return null;
}

function writeFallbackFile(data: EventBannerConfig) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("[eventBannerStorage] Failed to write fallback file:", err);
  }
}

/**
 * Retrieve current event banner configuration.
 * In production: Reads from Google Cloud Firestore (the global cloud source of truth).
 * In development: Uses local persisted file fallback for immediate offline updates, falling back to Firestore.
 */
export async function getStoredEventBanner(): Promise<EventBannerConfig> {
  const isProd = process.env.NODE_ENV === "production";

  if (isProd) {
    try {
      const { adminDb } = await import("@/backend/firebase/admin");
      const docSnap = await adminDb.collection("settings").doc("eventBanner").get();
      if (docSnap.exists) {
        return {
          ...DEFAULT_BANNER_CONFIG,
          ...(docSnap.data() as Partial<EventBannerConfig>),
        };
      }
    } catch (err) {
      console.warn("[eventBannerStorage] Production Firestore read fallback:", err);
    }
  }

  // Local development file check
  const fileData = readFallbackFile();
  if (fileData) {
    return {
      ...DEFAULT_BANNER_CONFIG,
      ...fileData,
    };
  }

  if (!isProd) {
    try {
      const { adminDb } = await import("@/backend/firebase/admin");
      const docSnap = await adminDb.collection("settings").doc("eventBanner").get();
      if (docSnap.exists) {
        return {
          ...DEFAULT_BANNER_CONFIG,
          ...(docSnap.data() as Partial<EventBannerConfig>),
        };
      }
    } catch {
      // offline dev
    }
  }

  return DEFAULT_BANNER_CONFIG;
}

/**
 * Save event banner configuration.
 * Persists to both local file storage and Firestore if credentials are active.
 */
export async function saveStoredEventBanner(payload: Partial<EventBannerConfig>): Promise<EventBannerConfig> {
  const current = await getStoredEventBanner();
  const merged: EventBannerConfig = {
    ...current,
    ...payload,
  };

  // Always persist locally
  writeFallbackFile(merged);

  // Attempt Firestore write (in production / when cloud credentials exist)
  try {
    const { adminDb } = await import("@/backend/firebase/admin");
    await adminDb.collection("settings").doc("eventBanner").set(merged, { merge: true });
  } catch (err) {
    console.warn("[eventBannerStorage] Firestore Admin write skipped/failed:", err);
  }

  return merged;
}
