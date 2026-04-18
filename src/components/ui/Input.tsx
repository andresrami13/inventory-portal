interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export default function Input({ label, error, id, ...props }: Props) {
  const inputId = id ?? label.toLowerCase().replace(/\s/g, '-')

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full rounded-xl border px-4 py-3 text-base outline-none transition
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
