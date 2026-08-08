import type { TransactionCategory } from '../types/transaction'

export interface CategoryStyle {
  /** Solid color for chart slices and swatches (SVG-friendly hex). */
  hex: string
  /** Tailwind classes for a subtle text/background badge. */
  badge: string
}

/**
 * Discreet category palette drawn from amber / sky / violet / rose / cyan /
 * emerald tones. Colors are intentionally muted to stay professional.
 */
export const CATEGORY_STYLES: Record<TransactionCategory, CategoryStyle> = {
  Alimentação: { hex: '#f59e0b', badge: 'bg-amber-50 text-amber-700' },
  Contas: { hex: '#0ea5e9', badge: 'bg-sky-50 text-sky-700' },
  Transporte: { hex: '#8b5cf6', badge: 'bg-violet-50 text-violet-700' },
  Lazer: { hex: '#f43f5e', badge: 'bg-rose-50 text-rose-700' },
  Saúde: { hex: '#06b6d4', badge: 'bg-cyan-50 text-cyan-700' },
  Educação: { hex: '#10b981', badge: 'bg-emerald-50 text-emerald-700' },
  Compras: { hex: '#d97706', badge: 'bg-amber-50 text-amber-700' },
  Salário: { hex: '#059669', badge: 'bg-emerald-50 text-emerald-700' },
  Investimentos: { hex: '#0284c7', badge: 'bg-sky-50 text-sky-700' },
  Outros: { hex: '#64748b', badge: 'bg-slate-100 text-slate-600' },
}

export function categoryHex(category: TransactionCategory): string {
  return CATEGORY_STYLES[category].hex
}

export function categoryBadge(category: TransactionCategory): string {
  return CATEGORY_STYLES[category].badge
}
