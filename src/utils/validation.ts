import {
  CATEGORIES,
  TRANSACTION_TYPES,
  type Transaction,
  type TransactionCategory,
  type TransactionDraft,
  type TransactionType,
} from '../types/transaction'
import { isValidDate } from './dates'

const DESCRIPTION_MIN = 2
const DESCRIPTION_MAX = 80

/** Collapses runs of whitespace and trims the ends. */
export function normalizeDescription(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

export type FieldName = 'description' | 'amount' | 'type' | 'category' | 'date'

export type ValidationErrors = Partial<Record<FieldName, string>>

export type ValidationResult =
  | { ok: true; value: TransactionDraft }
  | { ok: false; errors: ValidationErrors }

function isType(value: unknown): value is TransactionType {
  return typeof value === 'string' && TRANSACTION_TYPES.includes(value as TransactionType)
}

function isCategory(value: unknown): value is TransactionCategory {
  return typeof value === 'string' && CATEGORIES.includes(value as TransactionCategory)
}

/**
 * Validates raw, untrusted input into a normalized draft. Used by the form, by
 * localStorage loading, and by backup import — the UI is never the only guard.
 */
export function validateTransaction(input: unknown): ValidationResult {
  const errors: ValidationErrors = {}
  const data = (input ?? {}) as Record<string, unknown>

  const rawDescription = typeof data.description === 'string' ? data.description : ''
  const description = normalizeDescription(rawDescription)
  if (description.length < DESCRIPTION_MIN) {
    errors.description = 'Informe uma descrição com pelo menos 2 caracteres.'
  } else if (description.length > DESCRIPTION_MAX) {
    errors.description = 'A descrição deve ter no máximo 80 caracteres.'
  }

  const amount = typeof data.amount === 'number' ? data.amount : NaN
  if (!Number.isFinite(amount) || Number.isNaN(amount)) {
    errors.amount = 'Informe um valor numérico válido.'
  } else if (amount <= 0) {
    errors.amount = 'O valor deve ser maior que zero.'
  }

  if (!isType(data.type)) {
    errors.type = 'Selecione um tipo válido.'
  }

  if (!isCategory(data.category)) {
    errors.category = 'Selecione uma categoria válida.'
  }

  const date = typeof data.date === 'string' ? data.date : ''
  if (!isValidDate(date)) {
    errors.date = 'Informe uma data válida.'
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    value: {
      description,
      amount,
      type: data.type as TransactionType,
      category: data.category as TransactionCategory,
      date,
    },
  }
}

/** Type guard confirming an unknown value is a fully valid Transaction. */
export function isTransaction(input: unknown): input is Transaction {
  const data = (input ?? {}) as Record<string, unknown>
  if (typeof data.id !== 'string' || data.id.length === 0) return false
  return validateTransaction(data).ok
}
