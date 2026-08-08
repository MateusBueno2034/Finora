import type { Transaction, TransactionCategory } from '../types/transaction'

export function calcIncome(transactions: readonly Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
}

export function calcExpenses(transactions: readonly Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
}

export function calcBalance(transactions: readonly Transaction[]): number {
  return calcIncome(transactions) - calcExpenses(transactions)
}

export interface CategorySlice {
  category: TransactionCategory
  total: number
  percent: number
}

/**
 * Aggregates expenses by category, sorted from largest to smallest, with each
 * slice's share of the total expenses as a percentage.
 */
export function expensesByCategory(
  transactions: readonly Transaction[],
): CategorySlice[] {
  const totals = new Map<TransactionCategory, number>()

  for (const t of transactions) {
    if (t.type !== 'expense') continue
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount)
  }

  const grandTotal = [...totals.values()].reduce((sum, v) => sum + v, 0)
  if (grandTotal === 0) return []

  return [...totals.entries()]
    .map(([category, total]) => ({
      category,
      total,
      percent: (total / grandTotal) * 100,
    }))
    .sort((a, b) => b.total - a.total)
}
