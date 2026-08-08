import { useId, type SelectHTMLAttributes } from 'react'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: readonly SelectOption[]
  error?: string
  /** When true the label is present for a11y but visually hidden. */
  hideLabel?: boolean
}

export default function Select({
  label,
  options,
  error,
  hideLabel = false,
  className = '',
  id,
  ...rest
}: SelectProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={fieldId}
        className={
          hideLabel ? 'sr-only' : 'text-sm font-medium text-ink'
        }
      >
        {label}
      </label>
      <select
        id={fieldId}
        aria-invalid={error ? true : undefined}
        className={`rounded-lg border bg-card px-3 py-2.5 text-sm text-ink outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 disabled:opacity-50 ${
          error ? 'border-expense' : 'border-hair focus-visible:border-brand'
        } ${className}`}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-xs font-medium text-expense">{error}</p>
      ) : null}
    </div>
  )
}
