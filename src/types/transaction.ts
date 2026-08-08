export type TransactionType = 'income' | 'expense'

export type TransactionCategory =
  | 'Alimentação'
  | 'Contas'
  | 'Transporte'
  | 'Lazer'
  | 'Saúde'
  | 'Educação'
  | 'Compras'
  | 'Salário'
  | 'Investimentos'
  | 'Outros'

export interface Transaction {
  id: string
  description: string
  amount: number
  type: TransactionType
  category: TransactionCategory
  /** ISO date string, YYYY-MM-DD. */
  date: string
}

/** Fields collected from the form before an id/normalization is applied. */
export interface TransactionDraft {
  description: string
  amount: number
  type: TransactionType
  category: TransactionCategory
  date: string
}

export const TRANSACTION_TYPES: readonly TransactionType[] = ['income', 'expense']

export const CATEGORIES: readonly TransactionCategory[] = [
  'Alimentação',
  'Contas',
  'Transporte',
  'Lazer',
  'Saúde',
  'Educação',
  'Compras',
  'Salário',
  'Investimentos',
  'Outros',
]

export const TYPE_LABELS: Record<TransactionType, string> = {
  income: 'Receita',
  expense: 'Despesa',
}
