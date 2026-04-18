interface Props {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Eliminar', onConfirm, onCancel, loading }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} aria-hidden="true" />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
        <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
        <p className="text-gray-600 text-sm">{message}</p>
        <div className="flex gap-3 mt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition disabled:opacity-60"
          >
            {loading ? 'Eliminando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
