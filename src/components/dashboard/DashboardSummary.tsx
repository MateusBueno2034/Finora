import SummaryCard from './SummaryCard'
import { ArrowDownIcon, ArrowUpIcon, WalletIcon } from '../ui/icons'
import { formatCurrency } from '../../utils/money'

interface DashboardSummaryProps {
  balance: number
  income: number
  expenses: number
  periodLabel: string
}

export default function DashboardSummary({
  balance,
  income,
  expenses,
  periodLabel,
}: DashboardSummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <SummaryCard
        title="Saldo atual"
        value={formatCurrency(balance)}
        period={periodLabel}
        tone={balance < 0 ? 'expense' : 'neutral'}
        icon={<WalletIcon width={18} height={18} />}
      />
      <SummaryCard
        title="Receitas"
        value={formatCurrency(income)}
        period={periodLabel}
        tone="income"
        icon={<ArrowUpIcon width={18} height={18} />}
      />
      <SummaryCard
        title="Despesas"
        value={formatCurrency(expenses)}
        period={periodLabel}
        tone="expense"
        icon={<ArrowDownIcon width={18} height={18} />}
      />
    </div>
  )
}
