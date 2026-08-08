import type { ReactNode } from 'react'

type Tone = 'neutral' | 'income' | 'expense'

interface SummaryCardProps {
  title: string
  value: string
  period: string
  icon: ReactNode
  tone?: Tone
}

const TONE_STYLES: Record<Tone, { value: string; iconWrap: string }> = {
  neutral: { value: 'text-ink', iconWrap: 'bg-brand/10 text-brand' },
  income: { value: 'text-income', iconWrap: 'bg-emerald-50 text-income' },
  expense: { value: 'text-expense', iconWrap: 'bg-red-50 text-expense' },
}

export default function SummaryCard({
  title,
  value,
  period,
  icon,
  tone = 'neutral',
}: SummaryCardProps) {
  const styles = TONE_STYLES[tone]

  return (
    <div className="rounded-xl border border-hair bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted">{title}</p>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${styles.iconWrap}`}
          aria-hidden="true"
        >
          {icon}
        </span>
      </div>
      <p className={`mt-3 text-2xl font-semibold tracking-tight tnum ${styles.value}`}>
        {value}
      </p>
      <p className="mt-1 text-xs text-muted">{period}</p>
    </div>
  )
}
