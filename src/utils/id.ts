/**
 * Generates a unique id, preferring the native crypto.randomUUID() and falling
 * back to a timestamp-based value when it is unavailable.
 */
export function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
