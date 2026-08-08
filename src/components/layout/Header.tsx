import Button from '../ui/Button'
import Select from '../ui/Select'
import { LogoIcon, PlusIcon } from '../ui/icons'
import type { SelectOption } from '../ui/Select'

interface HeaderProps {
  periodOptions: readonly SelectOption[]
  period: string
  onPeriodChange: (value: string) => void
  onNewTransaction: () => void
}

export default function Header({
  periodOptions,
  period,
  onPeriodChange,
  onNewTransaction,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-hair bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
            <LogoIcon width={20} height={20} />
          </span>
          <div className="leading-tight">
            <span className="block text-lg font-semibold tracking-tight text-ink">
              Finora
            </span>
            <span className="block text-xs text-muted">Personal Finance Manager</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-40 sm:w-48">
            <Select
              label="Período"
              hideLabel
              options={periodOptions}
              value={period}
              onChange={(event) => onPeriodChange(event.target.value)}
            />
          </div>
          <Button onClick={onNewTransaction}>
            <PlusIcon width={18} height={18} />
            <span className="hidden sm:inline">Nova transação</span>
            <span className="sm:hidden">Nova</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
