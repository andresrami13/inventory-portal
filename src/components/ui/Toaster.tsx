import { useToastStore } from '../../store/toast.store'

export default function Toaster() {
  const { toasts, remove } = useToastStore()

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => remove(t.id)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg text-sm font-medium pointer-events-auto cursor-pointer border backdrop-blur-sm
            animate-[slideDown_0.2s_ease-out] whitespace-nowrap
            ${t.type === 'success'
              ? 'bg-purple-800 text-white border-purple-700/50'
              : 'bg-red-600 text-white border-red-500/50'
            }`}
        >
          {t.type === 'success' ? (
            <svg className="w-4 h-4 flex-shrink-0 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}
