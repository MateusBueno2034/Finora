import { useId, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export default function Input({
  label,
  error,
  hint,
  className = '',
  id,
  ...rest
}: InputProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const describedBy = error
    ? `${fieldId}-error`
    : hint
      ? `${fieldId}-hint`
      : undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`rounded-lg border bg-card px-3 py-2.5 text-sm text-ink placeholder:text-muted/70 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 disabled:opacity-50 ${
          error ? 'border-expense focus-visible:ring-expense/30' : 'border-hair focus-visible:border-brand'
        } ${className}`}
        {...rest}
      />
      {error ? (
        <p id={`${fieldId}-error`} className="text-xs font-medium text-expense">
          {error}
        </p>
      ) : hint ? (
        <p id={`${fieldId}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
