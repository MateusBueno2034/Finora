import type { Transaction } from '../types/transaction'
import { isTransaction } from '../utils/validation'

const BACKUP_VERSION = 1

export interface BackupFile {
  version: number
  exportedAt: string
  transactions: Transaction[]
}

export type ImportResult =
  | { ok: true; transactions: Transaction[] }
  | { ok: false; error: string }

/**
 * Builds a versioned backup payload and triggers a local download using only
 * native browser APIs (Blob + object URL). Nothing leaves the browser.
 */
export function exportBackup(transactions: readonly Transaction[]): void {
  const payload: BackupFile = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    transactions: [...transactions],
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)

  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `finora-backup-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

/**
 * Parses and fully validates an imported backup file's text. Every layer is
 * checked before any transaction is trusted: valid JSON, known version, correct
 * structure, and each transaction validated individually.
 */
export function parseBackup(text: string): ImportResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, error: 'O arquivo não contém um JSON válido.' }
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return { ok: false, error: 'A estrutura do arquivo de backup é inválida.' }
  }

  const data = parsed as Record<string, unknown>

  if (data.version !== BACKUP_VERSION) {
    return {
      ok: false,
      error: `Versão de backup não suportada. Esperado: ${BACKUP_VERSION}.`,
    }
  }

  if (!Array.isArray(data.transactions)) {
    return { ok: false, error: 'O backup não contém uma lista de transações.' }
  }

  const transactions: Transaction[] = []
  for (const item of data.transactions) {
    if (!isTransaction(item)) {
      return {
        ok: false,
        error: 'O backup contém transações inválidas e não pode ser importado.',
      }
    }
    transactions.push(item)
  }

  return { ok: true, transactions }
}
