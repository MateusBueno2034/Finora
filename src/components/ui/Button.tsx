import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-brand text-white hover:bg-brand-strong focus-visible:ring-brand/40 shadow-sm',
  secondary:
    'bg-card text-ink border border-hair hover:bg-slate-50 focus-visible:ring-brand/30',
  ghost:
    'bg-transparent text-muted hover:bg-slate-100 hover:text-ink focus-visible:ring-brand/30',
  danger:
    'bg-expense text-white hover:bg-red-600 focus-visible:ring-red-400/40 shadow-sm',
}

export default function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
