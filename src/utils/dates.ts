const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/** Returns true when `value` is a valid ISO calendar date (YYYY-MM-DD). */
export function isValidDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const parsed = new Date(year, month - 1, day)
  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day
  )
}

/** Formats an ISO date (YYYY-MM-DD) as "07/08/2026". */
export function formatDate(iso: string): string {
  if (!isValidDate(iso)) return iso
  const [year, month, day] = iso.split('-').map(Number)
  return dateFormatter.format(new Date(year, month - 1, day))
}

/** Today's date as an ISO string suitable for a date input default. */
export function todayIso(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

/** Extracts the "YYYY-MM" month key from an ISO date. */
export function monthKey(iso: string): string {
  return iso.slice(0, 7)
}

/** Human label for a "YYYY-MM" key, e.g. "Agosto de 2026". */
export function monthLabel(key: string): string {
  const [year, month] = key.split('-').map(Number)
  const label = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, 1))
  return label.charAt(0).toUpperCase() + label.slice(1)
}
