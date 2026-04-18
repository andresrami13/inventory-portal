import { useToastStore } from '../../store/toast.store'

export default function Toaster() {
  const { toasts, remove } = useToastStore()

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => remove(t.id)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium pointer-events-auto cursor-pointer
            animate-[slideDown_0.2s_ease-out]
            ${t.type === 'success' ? 'bg-gray-900 text-white' : 'bg-red-600 text-white'}`}
        >
          {t.type === 'success' ? (
            <svg className="w-4 h-4 flex-shrink-0 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="flex-1">{t.message}</span>
        </div>
      ))}
    </div>
  )
}
