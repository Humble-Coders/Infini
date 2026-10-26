/**
 * Plain JSON copy of server data for a client component prop: exactly what the
 * matching /api/admin route would have returned (Timestamps become plain
 * objects), so a page can hand a screen its first data without a round trip.
 */
export function toClientJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
