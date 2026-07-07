/**
 * The API Flow Guide documents endpoints but not the exact shape of list
 * responses (e.g. whether GET /portal/customers returns a bare array, or
 * `{ customers: [...] }`, `{ items: [...] }`, etc). These helpers unwrap
 * whichever shape shows up so the rest of the app doesn't need to guess.
 */
export function asArray<T>(payload: unknown, keys: string[] = []): T[] {
  if (Array.isArray(payload)) return payload as T[]
  if (payload && typeof payload === "object") {
    for (const key of ["items", "results", "customers", "transactions", "data", ...keys]) {
      const value = (payload as Record<string, unknown>)[key]
      if (Array.isArray(value)) return value as T[]
    }
  }
  return []
}
