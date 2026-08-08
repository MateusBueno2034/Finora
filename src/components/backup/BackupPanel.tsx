import { useRef, useState } from 'react'
import type { Transaction } from '../../types/transaction'
import { exportBackup, parseBackup } from '../../services/backup'
import Button from '../ui/Button'
import ConfirmDialog from '../ui/ConfirmDialog'
import { DownloadIcon, ShieldIcon, UploadIcon } from '../ui/icons'

interface BackupPanelProps {
  transactions: Transaction[]
  onReplace: (transactions: Transaction[]) => void
}

type Status = { kind: 'error' | 'success'; message: string } | null

export default function BackupPanel({ transactions, onReplace }: BackupPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<Status>(null)
  const [pending, setPending] = useState<Transaction[] | null>(null)

  const handleExport = () => {
    exportBackup(transactions)
    setStatus({ kind: 'success', message: 'Backup exportado com sucesso.' })
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    // Allow re-importing the same file later.
    event.target.value = ''
    if (!file) return

    let text: string
    try {
      text = await file.text()
    } catch {
      setStatus({ kind: 'error', message: 'Não foi possível ler o arquivo.' })
      return
    }

    const result = parseBackup(text)
    if (!result.ok) {
      setStatus({ kind: 'error', message: result.error })
      return
    }

    setStatus(null)
    setPending(result.transactions)
  }

  const confirmImport = () => {
    if (pending) {
      onReplace(pending)
      setStatus({
        kind: 'success',
        message: `${pending.length} transação(ões) importada(s) com sucesso.`,
      })
    }
    setPending(null)
  }

  return (
    <section
      aria-labelledby="backup-title"
      className="rounded-xl border border-hair bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="backup-title" className="text-base font-semibold text-ink">
            Backup dos dados
          </h2>
          <p className="mt-1 text-sm text-muted">
            Exporte ou restaure suas transações. Tudo acontece localmente no seu
            navegador.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleExport}>
            <DownloadIcon width={18} height={18} />
            Exportar backup
          </Button>
          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon width={18} height={18} />
            Importar backup
          </Button>
          <label htmlFor="backup-file" className="sr-only">
            Selecionar arquivo de backup
          </label>
          <input
            ref={fileInputRef}
            id="backup-file"
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <p className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-muted">
        <ShieldIcon width={16} height={16} className="mt-0.5 shrink-0 text-brand" />
        <span>
          O backup contém seus dados financeiros em formato legível. Guarde-o em
          local seguro.
        </span>
      </p>

      {status ? (
        <p
          role="status"
          className={`mt-3 text-sm font-medium ${status.kind === 'error' ? 'text-expense' : 'text-income'}`}
        >
          {status.message}
        </p>
      ) : null}

      <ConfirmDialog
        open={pending !== null}
        title="Substituir dados atuais?"
        message="A importação substituirá todas as suas transações atuais pelos dados do arquivo. Esta ação não pode ser desfeita."
        confirmLabel="Substituir"
        destructive
        onConfirm={confirmImport}
        onCancel={() => setPending(null)}
      />
    </section>
  )
}
