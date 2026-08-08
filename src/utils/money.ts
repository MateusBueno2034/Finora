const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

/** Formats a positive number as Brazilian currency, e.g. 1150 -> "R$ 1.150,00". */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

/**
 * Formats a value with an explicit sign for income (+) / expense (-).
 * The magnitude is always the absolute value; the sign encodes direction.
 */
export function formatSignedCurrency(amount: number, isExpense: boolean): string {
  const magnitude = formatCurrency(Math.abs(amount))
  return `${isExpense ? '-' : '+'}${magnitude}`
}

/**
 * Parses user input (accepting both "1.150,00" and "1150.00" styles) into a
 * number. Returns NaN when it cannot be parsed so callers can validate.
 */
export function parseAmount(raw: string): number {
  const trimmed = raw.trim()
  if (trimmed === '') return NaN

  // If both separators are present, assume pt-BR grouping ("."), decimal (",").
  let normalized = trimmed
  if (trimmed.includes(',') && trimmed.includes('.')) {
    normalized = trimmed.replace(/\./g, '').replace(',', '.')
  } else if (trimmed.includes(',')) {
    normalized = trimmed.replace(',', '.')
  }

  return Number(normalized)
}
