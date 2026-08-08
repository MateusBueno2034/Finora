import { useMemo, useState } from 'react'
import Header from './components/layout/Header'
import DashboardSummary from './components/dashboard/DashboardSummary'
import ExpenseChart from './components/dashboard/ExpenseChart'
import TransactionFilters, {
  type FiltersState,
} from './components/filters/TransactionFilters'
import TransactionList from './components/transactions/TransactionList'
import TransactionModal from './components/transactions/TransactionModal'
import BackupPanel from './components/backup/BackupPanel'
import EmptyState from './components/common/EmptyState'
import ConfirmDialog from './components/ui/ConfirmDialog'
import type { SelectOption } from './components/ui/Select'
import { useTransactions } from './hooks/useTransactions'
import {
  calcBalance,
  calcExpenses,
  calcIncome,
  expensesByCategory,
} from './utils/finance'
import { monthKey, monthLabel } from './utils/dates'
import { normalizeDescription } from './utils/validation'
import type { Transaction, TransactionDraft } from './types/transaction'

const INITIAL_FILTERS: FiltersState = {
  search: '',
  month: 'all',
  type: 'all',
  category: 'all',
}

export default function App() {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    removeTransaction,
    replaceAll,
  } = useTransactions()

  const [filters, setFilters] = useState<FiltersState>(INITIAL_FILTERS)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [deleting, setDeleting] = useState<Transaction | null>(null)

  // Month options derived from the data, plus an "all periods" entry.
  const monthOptions = useMemo<SelectOption[]>(() => {
    const keys = new Set<string>()
    for (const t of transactions) keys.add(monthKey(t.date))
    const sorted = [...keys].sort((a, b) => b.localeCompare(a))
    return [
      { value: 'all', label: 'Todos os períodos' },
      ...sorted.map((key) => ({ value: key, label: monthLabel(key) })),
    ]
  }, [transactions])

  // The dashboard + chart reflect only the selected period (month).
  const periodTransactions = useMemo(() => {
    if (filters.month === 'all') return transactions
    return transactions.filter((t) => monthKey(t.date) === filters.month)
  }, [transactions, filters.month])

  const balance = useMemo(() => calcBalance(periodTransactions), [periodTransactions])
  const income = useMemo(() => calcIncome(periodTransactions), [periodTransactions])
  const expenses = useMemo(
    () => calcExpenses(periodTransactions),
    [periodTransactions],
  )
  const breakdown = useMemo(
    () => expensesByCategory(periodTransactions),
    [periodTransactions],
  )

  // The transaction list applies every active filter.
  const filtered = useMemo(() => {
    const search = normalizeDescription(filters.search).toLowerCase()
    return transactions.filter((t) => {
      if (filters.month !== 'all' && monthKey(t.date) !== filters.month) return false
      if (filters.type !== 'all' && t.type !== filters.type) return false
      if (filters.category !== 'all' && t.category !== filters.category) return false
      if (search && !t.description.toLowerCase().includes(search)) return false
      return true
    })
  }, [transactions, filters])

  const periodLabel =
    filters.month === 'all' ? 'Todos os períodos' : monthLabel(filters.month)

  const hasActiveFilters =
    filters.search !== '' ||
    filters.month !== 'all' ||
    filters.type !== 'all' ||
    filters.category !== 'all'

  const openNew = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (transaction: Transaction) => {
    setEditing(transaction)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
  }

  const handleSubmit = (draft: TransactionDraft) => {
    if (editing) {
      updateTransaction(editing.id, draft)
    } else {
      addTransaction(draft)
    }
    closeModal()
  }

  const confirmDelete = () => {
    if (deleting) removeTransaction(deleting.id)
    setDeleting(null)
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Header
        periodOptions={monthOptions}
        period={filters.month}
        onPeriodChange={(month) => setFilters((prev) => ({ ...prev, month }))}
        onNewTransaction={openNew}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Visão geral
          </h1>
          <p className="mt-1 text-sm text-muted">
            Acompanhe suas finanças e mantenha seu orçamento sob controle.
          </p>
        </div>

        <DashboardSummary
          balance={balance}
          income={income}
          expenses={expenses}
          periodLabel={periodLabel}
        />

        <div className="mt-6">
          <ExpenseChart slices={breakdown} total={expenses} />
        </div>

        <section aria-labelledby="transactions-title" className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="transactions-title" className="text-lg font-semibold text-ink">
              Transações
            </h2>
            <span className="text-sm text-muted tnum">
              {filtered.length} de {transactions.length}
            </span>
          </div>

          <div className="mb-4">
            <TransactionFilters
              filters={filters}
              monthOptions={monthOptions}
              onChange={setFilters}
              onClear={() => setFilters(INITIAL_FILTERS)}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {filtered.length > 0 ? (
            <TransactionList
              transactions={filtered}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          ) : (
            <EmptyState onAdd={openNew} filtered={hasActiveFilters} />
          )}
        </section>

        <div className="mt-8">
          <BackupPanel transactions={transactions} onReplace={replaceAll} />
        </div>

        <footer className="mt-10 border-t border-hair pt-6 text-center text-xs text-muted">
          Finora · Seus dados permanecem exclusivamente neste navegador. Nenhuma
          informação é enviada para servidores.
        </footer>
      </main>

      <TransactionModal
        open={modalOpen}
        editing={editing}
        onSubmit={handleSubmit}
        onClose={closeModal}
      />

      <ConfirmDialog
        open={deleting !== null}
        title="Excluir transação?"
        message={
          deleting
            ? `Tem certeza de que deseja excluir "${deleting.description}"? Esta ação não pode ser desfeita.`
            : ''
        }
        confirmLabel="Excluir"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
