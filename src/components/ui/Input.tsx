interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export default function Input({ label, error, id, ...props }: Props) {
  const inputId = id ?? label.toLowerCase().replace(/\s/g, '-')

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={inputId} className="text-sm font-medium text-purple-700 pl-1">
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full rounded-2xl border px-5 py-4 text-base outline-none transition
          focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-center
          ${error ? 'border-red-300 bg-red-50 text-red-900 placeholder:text-red-300' : 'border-purple-100 bg-white text-purple-950 placeholder:text-purple-300'}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500 pl-1">{error}</p>}
    </div>
  )
}
