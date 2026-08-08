import { useState, type FormEvent } from 'react'
import {
  CATEGORIES,
  type Transaction,
  type TransactionCategory,
  type TransactionDraft,
  type TransactionType,
} from '../../types/transaction'
import { todayIso } from '../../utils/dates'
import { parseAmount } from '../../utils/money'
import {
  validateTransaction,
  type ValidationErrors,
} from '../../utils/validation'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import type { SelectOption } from '../ui/Select'

interface TransactionFormProps {
  /** When provided, the form edits this transaction instead of creating one. */
  initial?: Transaction
  submitLabel: string
  onSubmit: (draft: TransactionDraft) => void
  onCancel: () => void
}

const TYPE_OPTIONS: readonly SelectOption[] = [
  { value: 'income', label: 'Receita' },
  { value: 'expense', label: 'Despesa' },
]

const CATEGORY_OPTIONS: readonly SelectOption[] = CATEGORIES.map((category) => ({
  value: category,
  label: category,
}))

export default function TransactionForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  const [description, setDescription] = useState(initial?.description ?? '')
  const [amount, setAmount] = useState(
    initial ? String(initial.amount).replace('.', ',') : '',
  )
  const [type, setType] = useState<TransactionType>(initial?.type ?? 'expense')
  const [category, setCategory] = useState<TransactionCategory>(
    initial?.category ?? 'Alimentação',
  )
  const [date, setDate] = useState(initial?.date ?? todayIso())
  const [errors, setErrors] = useState<ValidationErrors>({})

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = validateTransaction({
      description,
      amount: parseAmount(amount),
      type,
      category,
      date,
    })

    if (!result.ok) {
      setErrors(result.errors)
      return
    }

    setErrors({})
    onSubmit(result.value)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input
        label="Descrição"
        value={description}
        maxLength={80}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Ex.: Supermercado"
        error={errors.description}
        autoComplete="off"
      />

      <Input
        label="Valor (R$)"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        placeholder="0,00"
        inputMode="decimal"
        error={errors.amount}
        autoComplete="off"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Tipo"
          options={TYPE_OPTIONS}
          value={type}
          onChange={(event) => setType(event.target.value as TransactionType)}
          error={errors.type}
        />
        <Select
          label="Categoria"
          options={CATEGORY_OPTIONS}
          value={category}
          onChange={(event) =>
            setCategory(event.target.value as TransactionCategory)
          }
          error={errors.category}
        />
      </div>

      <Input
        label="Data"
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        error={errors.date}
      />

      <div className="mt-1 flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}
