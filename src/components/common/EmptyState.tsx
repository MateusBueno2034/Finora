import Button from '../ui/Button'
import { InboxIcon, PlusIcon } from '../ui/icons'

interface EmptyStateProps {
  onAdd: () => void
  filtered: boolean
}

export default function EmptyState({ onAdd, filtered }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-hair bg-card px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-muted">
        <InboxIcon width={26} height={26} />
      </span>
      <h3 className="text-base font-semibold text-ink">
        Nenhuma transação encontrada
      </h3>
      <p className="max-w-sm text-sm text-muted">
        {filtered
          ? 'Nenhuma transação corresponde aos filtros aplicados. Ajuste ou limpe os filtros para ver mais resultados.'
          : 'Adicione sua primeira transação para começar a acompanhar suas finanças.'}
      </p>
      {!filtered ? (
        <Button onClick={onAdd} className="mt-1">
          <PlusIcon width={18} height={18} />
          Adicionar transação
        </Button>
      ) : null}
    </div>
  )
}
