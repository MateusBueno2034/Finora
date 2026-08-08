import Select from '../ui/Select'
import type { SelectOption } from '../ui/Select'
import { SearchIcon } from '../ui/icons'
import { CATEGORIES } from '../../types/transaction'

export interface FiltersState {
  search: string
  month: string
  type: 'all' | 'income' | 'expense'
  category: 'all' | string
}

interface TransactionFiltersProps {
  filters: FiltersState
  monthOptions: readonly SelectOption[]
  onChange: (next: FiltersState) => void
  onClear: () => void
  hasActiveFilters: boolean
}

const TYPE_OPTIONS: readonly SelectOption[] = [
  { value: 'all', label: 'Todos' },
  { value: 'income', label: 'Receitas' },
  { value: 'expense', label: 'Despesas' },
]

export default function TransactionFilters({
  filters,
  monthOptions,
  onChange,
  onClear,
  hasActiveFilters,
}: TransactionFiltersProps) {
  const categoryOptions: SelectOption[] = [
    { value: 'all', label: 'Todas as categorias' },
    ...CATEGORIES.map((category) => ({ value: category, label: category })),
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="sm:col-span-2 lg:col-span-1">
        <label htmlFor="filter-search" className="sr-only">
          Buscar por descrição
        </label>
        <div className="relative">
          <span
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted"
            aria-hidden="true"
          >
            <SearchIcon width={18} height={18} />
          </span>
          <input
            id="filter-search"
            type="search"
            value={filters.search}
            onChange={(event) =>
              onChange({ ...filters, search: event.target.value })
            }
            placeholder="Buscar por descrição"
            className="w-full rounded-lg border border-hair bg-card py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-colors focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/30"
          />
        </div>
      </div>

      <Select
        label="Mês"
        hideLabel
        options={monthOptions}
        value={filters.month}
        onChange={(event) => onChange({ ...filters, month: event.target.value })}
      />
      <Select
        label="Tipo"
        hideLabel
        options={TYPE_OPTIONS}
        value={filters.type}
        onChange={(event) =>
          onChange({
            ...filters,
            type: event.target.value as FiltersState['type'],
          })
        }
      />
      <div className="flex gap-3">
        <div className="flex-1">
          <Select
            label="Categoria"
            hideLabel
            options={categoryOptions}
            value={filters.category}
            onChange={(event) =>
              onChange({ ...filters, category: event.target.value })
            }
          />
        </div>
        <button
          type="button"
          onClick={onClear}
          disabled={!hasActiveFilters}
          className="shrink-0 rounded-lg border border-hair bg-card px-3 py-2.5 text-sm font-medium text-muted outline-none transition-colors hover:bg-slate-50 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Limpar
        </button>
      </div>
    </div>
  )
}
