import type { Transaction } from '../types/transaction'
import { createId } from '../utils/id'

/**
 * Fictitious demonstration data seeded on first launch only. Contains no real
 * personal information.
 */
export function createSeedTransactions(): Transaction[] {
  const seeds: Omit<Transaction, 'id'>[] = [
    { description: 'Salário', amount: 2000, type: 'income', category: 'Salário', date: '2026-08-05' },
    { description: 'Rendimento de investimentos', amount: 180, type: 'income', category: 'Investimentos', date: '2026-08-03' },
    { description: 'Internet', amount: 150, type: 'expense', category: 'Contas', date: '2026-08-07' },
    { description: 'Supermercado', amount: 280, type: 'expense', category: 'Alimentação', date: '2026-08-06' },
    { description: 'Combustível', amount: 120, type: 'expense', category: 'Transporte', date: '2026-08-04' },
    { description: 'Cinema', amount: 60, type: 'expense', category: 'Lazer', date: '2026-08-02' },
    { description: 'Curso online', amount: 90, type: 'expense', category: 'Educação', date: '2026-08-01' },
    { description: 'Farmácia', amount: 45, type: 'expense', category: 'Saúde', date: '2026-08-01' },
  ]

  return seeds.map((seed) => ({ ...seed, id: createId() }))
}
