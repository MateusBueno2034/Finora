import type { Transaction, TransactionDraft } from '../../types/transaction'
import Modal from '../ui/Modal'
import TransactionForm from './TransactionForm'

interface TransactionModalProps {
  open: boolean
  editing: Transaction | null
  onSubmit: (draft: TransactionDraft) => void
  onClose: () => void
}

export default function TransactionModal({
  open,
  editing,
  onSubmit,
  onClose,
}: TransactionModalProps) {
  const isEditing = editing !== null

  return (
    <Modal
      open={open}
      title={isEditing ? 'Editar transação' : 'Nova transação'}
      onClose={onClose}
    >
      {/* Remount the form per record so its controlled fields reset correctly. */}
      <TransactionForm
        key={editing?.id ?? 'new'}
        initial={editing ?? undefined}
        submitLabel={isEditing ? 'Salvar alterações' : 'Adicionar transação'}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  )
}
