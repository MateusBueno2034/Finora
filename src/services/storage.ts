import type { Transaction } from '../types/transaction'
import { isTransaction } from '../utils/validation'

const STORAGE_KEY = 'finora:transactions'
const INIT_KEY = 'finora:initialized'

/**
 * Central access point for localStorage. No component should touch localStorage
 * directly. Every read is defensive: corrupted JSON or invalid records are
 * discarded instead of crashing the app.
 */

function isStorageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage
  } catch {
    return false
  }
}

/** Loads and validates stored transactions. Returns [] on any problem. */
export function loadTransactions(): Transaction[] {
  if (!isStorageAvailable()) return []

  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return []
  }
  if (raw === null) return []

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    // Corrupted JSON — never trust it, never crash.
    return []
  }

  if (!Array.isArray(parsed)) return []

  return parsed.filter(isTransaction)
}

/** Persists transactions. Silently no-ops if storage is unavailable. */
export function saveTransactions(transactions: readonly Transaction[]): void {
  if (!isStorageAvailable()) return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  } catch {
    // Quota errors etc. must not break the UI.
  }
}

export function hasBeenInitialized(): boolean {
  if (!isStorageAvailable()) return true
  try {
    return window.localStorage.getItem(INIT_KEY) === 'true'
  } catch {
    return true
  }
}

export function markInitialized(): void {
  if (!isStorageAvailable()) return
  try {
    window.localStorage.setItem(INIT_KEY, 'true')
  } catch {
    // ignore
  }
}
