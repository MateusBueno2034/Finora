import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Transaction, TransactionDraft } from '../types/transaction'
import { createSeedTransactions } from '../data/seed'
import {
  hasBeenInitialized,
  loadTransactions,
  markInitialized,
  saveTransactions,
} from '../services/storage'
import {
  calcBalance,
  calcExpenses,
  calcIncome,
  expensesByCategory,
} from '../utils/finance'
import { createId } from '../utils/id'

export interface UseTransactions {
  transactions: Transaction[]
  balance: number
  income: number
  expenses: number
  categoryBreakdown: ReturnType<typeof expensesByCategory>
  addTransaction: (draft: TransactionDraft) => void
  updateTransaction: (id: string, draft: TransactionDraft) => void
  removeTransaction: (id: string) => void
  replaceAll: (next: Transaction[]) => void
}

function sortByDateDesc(list: Transaction[]): Transaction[] {
  return [...list].sort((a, b) => b.date.localeCompare(a.date))
}

/**
 * Owns all persistence and mutation logic for transactions. Visual components
 * never touch storage directly — they call these actions.
 */
export function useTransactions(): UseTransactions {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const stored = loadTransactions()
    if (stored.length === 0 && !hasBeenInitialized()) {
      const seeded = createSeedTransactions()
      saveTransactions(seeded)
      markInitialized()
      return sortByDateDesc(seeded)
    }
    // Ensure the init flag is set so demo data never returns after a full wipe.
    if (!hasBeenInitialized()) markInitialized()
    return sortByDateDesc(stored)
  })

  useEffect(() => {
    saveTransactions(transactions)
  }, [transactions])

  const addTransaction = useCallback((draft: TransactionDraft) => {
    setTransactions((prev) =>
      sortByDateDesc([...prev, { ...draft, id: createId() }]),
    )
  }, [])

  const updateTransaction = useCallback((id: string, draft: TransactionDraft) => {
    setTransactions((prev) =>
      sortByDateDesc(prev.map((t) => (t.id === id ? { ...draft, id } : t))),
    )
  }, [])

  const removeTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const replaceAll = useCallback((next: Transaction[]) => {
    setTransactions(sortByDateDesc(next))
  }, [])

  const income = useMemo(() => calcIncome(transactions), [transactions])
  const expenses = useMemo(() => calcExpenses(transactions), [transactions])
  const balance = useMemo(() => calcBalance(transactions), [transactions])
  const categoryBreakdown = useMemo(
    () => expensesByCategory(transactions),
    [transactions],
  )

  return {
    transactions,
    balance,
    income,
    expenses,
    categoryBreakdown,
    addTransaction,
    updateTransaction,
    removeTransaction,
    replaceAll,
  }
}
