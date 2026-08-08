import type { Transaction } from '../../types/transaction'
import { TYPE_LABELS } from '../../types/transaction'
import { categoryBadge } from '../../utils/categories'
import { formatDate } from '../../utils/dates'
import { formatSignedCurrency } from '../../utils/money'
import { PencilIcon, TrashIcon } from '../ui/icons'

interface TransactionItemProps {
  transaction: Transaction
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

function CategoryBadge({ transaction }: { transaction: Transaction }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryBadge(transaction.category)}`}
    >
      {transaction.category}
    </span>
  )
}

function TypeBadge({ transaction }: { transaction: Transaction }) {
  const isExpense = transaction.type === 'expense'
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${isExpense ? 'text-expense' : 'text-income'}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${isExpense ? 'bg-expense' : 'bg-income'}`}
      />
      {TYPE_LABELS[transaction.type]}
    </span>
  )
}

function Actions({ transaction, onEdit, onDelete }: TransactionItemProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onEdit(transaction)}
        aria-label={`Editar transação ${transaction.description}`}
        className="rounded-md p-2 text-muted outline-none transition-colors hover:bg-slate-100 hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/30"
      >
        <PencilIcon width={16} height={16} />
      </button>
      <button
        type="button"
        onClick={() => onDelete(transaction)}
        aria-label={`Excluir transação ${transaction.description}`}
        className="rounded-md p-2 text-muted outline-none transition-colors hover:bg-red-50 hover:text-expense focus-visible:ring-2 focus-visible:ring-red-400/40"
      >
        <TrashIcon width={16} height={16} />
      </button>
    </div>
  )
}

export default function TransactionItem(props: TransactionItemProps) {
  const { transaction } = props
  const isExpense = transaction.type === 'expense'
  const amountClass = isExpense ? 'text-expense' : 'text-income'

  return (
    <>
      {/* Desktop table row */}
      <tr className="hidden border-t border-hair transition-colors hover:bg-slate-50/60 sm:table-row">
        <td className="px-4 py-3 text-sm font-medium text-ink">
          {transaction.description}
        </td>
        <td className="px-4 py-3">
          <CategoryBadge transaction={transaction} />
        </td>
        <td className="px-4 py-3 text-sm text-muted tnum">
          {formatDate(transaction.date)}
        </td>
        <td className="px-4 py-3">
          <TypeBadge transaction={transaction} />
        </td>
        <td className={`px-4 py-3 text-right text-sm font-semibold tnum ${amountClass}`}>
          {formatSignedCurrency(transaction.amount, isExpense)}
        </td>
        <td className="px-4 py-3">
          <div className="flex justify-end">
            <Actions {...props} />
          </div>
        </td>
      </tr>
    </>
  )
}

/** Mobile card variant, rendered separately from the table. */
export function TransactionCard(props: TransactionItemProps) {
  const { transaction } = props
  const isExpense = transaction.type === 'expense'
  const amountClass = isExpense ? 'text-expense' : 'text-income'

  return (
    <li className="rounded-xl border border-hair bg-card p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">
            {transaction.description}
          </p>
          <p className="mt-0.5 text-xs text-muted tnum">
            {formatDate(transaction.date)}
          </p>
        </div>
        <span className={`shrink-0 text-sm font-semibold tnum ${amountClass}`}>
          {formatSignedCurrency(transaction.amount, isExpense)}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CategoryBadge transaction={transaction} />
          <TypeBadge transaction={transaction} />
        </div>
        <Actions {...props} />
      </div>
    </li>
  )
}
