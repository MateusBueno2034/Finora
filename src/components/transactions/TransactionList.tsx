import type { Transaction } from '../../types/transaction'
import TransactionItem, { TransactionCard } from './TransactionItem'

interface TransactionListProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: TransactionListProps) {
  return (
    <div>
      {/* Desktop: table */}
      <div className="hidden overflow-hidden rounded-xl border border-hair bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Lista de transações</caption>
          <thead>
            <tr className="bg-slate-50/70 text-xs font-semibold uppercase tracking-wide text-muted">
              <th scope="col" className="px-4 py-3">
                Descrição
              </th>
              <th scope="col" className="px-4 py-3">
                Categoria
              </th>
              <th scope="col" className="px-4 py-3">
                Data
              </th>
              <th scope="col" className="px-4 py-3">
                Tipo
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Valor
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <ul className="flex flex-col gap-3 sm:hidden">
        {transactions.map((transaction) => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  )
}
