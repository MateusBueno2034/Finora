import type { CategorySlice } from '../../utils/finance'
import { categoryHex } from '../../utils/categories'
import { formatCurrency } from '../../utils/money'
import { InboxIcon } from '../ui/icons'

interface ExpenseChartProps {
  slices: CategorySlice[]
  total: number
}

const SIZE = 180
const STROKE = 26
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const CENTER = SIZE / 2

export default function ExpenseChart({ slices, total }: ExpenseChartProps) {
  const hasData = slices.length > 0

  // Accumulate the starting offset for each arc as we walk the slices.
  let offset = 0

  return (
    <section
      aria-labelledby="expense-chart-title"
      className="rounded-xl border border-hair bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
    >
      <h2 id="expense-chart-title" className="text-base font-semibold text-ink">
        Gastos por categoria
      </h2>
      <p className="mt-1 text-sm text-muted">
        Distribuição das despesas do período selecionado.
      </p>

      {hasData ? (
        <div className="mt-5 flex flex-col items-center gap-6 lg:flex-row lg:items-start">
          <div className="relative shrink-0">
            <svg
              width={SIZE}
              height={SIZE}
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              role="img"
              aria-label={`Gráfico de despesas por categoria, total ${formatCurrency(total)}`}
            >
              <circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke="#eef2f7"
                strokeWidth={STROKE}
              />
              {slices.map((slice) => {
                const dash = (slice.percent / 100) * CIRCUMFERENCE
                const gap = CIRCUMFERENCE - dash
                const dashOffset = -offset
                offset += dash
                return (
                  <circle
                    key={slice.category}
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    fill="none"
                    stroke={categoryHex(slice.category)}
                    strokeWidth={STROKE}
                    strokeDasharray={`${dash} ${gap}`}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="butt"
                    transform={`rotate(-90 ${CENTER} ${CENTER})`}
                  >
                    <title>{`${slice.category}: ${slice.percent.toFixed(0)}%`}</title>
                  </circle>
                )
              })}
              <text
                x={CENTER}
                y={CENTER - 6}
                textAnchor="middle"
                className="fill-muted text-[11px]"
              >
                Total
              </text>
              <text
                x={CENTER}
                y={CENTER + 14}
                textAnchor="middle"
                className="fill-ink text-[15px] font-semibold"
              >
                {formatCurrency(total)}
              </text>
            </svg>
          </div>

          <ul className="flex w-full flex-col gap-2.5">
            {slices.map((slice) => (
              <li
                key={slice.category}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <svg
                    width={10}
                    height={10}
                    viewBox="0 0 10 10"
                    className="shrink-0"
                    aria-hidden="true"
                  >
                    <circle cx="5" cy="5" r="5" fill={categoryHex(slice.category)} />
                  </svg>
                  <span className="truncate font-medium text-ink">
                    {slice.category}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-3 tnum">
                  <span className="text-muted">{slice.percent.toFixed(0)}%</span>
                  <span className="w-24 text-right font-medium text-ink">
                    {formatCurrency(slice.total)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center gap-2 py-8 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-muted">
            <InboxIcon width={22} height={22} />
          </span>
          <p className="text-sm text-muted">
            Nenhuma despesa registrada neste período.
          </p>
        </div>
      )}
    </section>
  )
}
