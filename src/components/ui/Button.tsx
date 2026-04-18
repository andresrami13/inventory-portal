interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  variant?: 'primary' | 'ghost'
}

export default function Button({ loading, variant = 'primary', children, className = '', ...props }: Props) {
  const base = 'w-full py-3 px-4 rounded-xl text-base font-semibold transition active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed'
  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    ghost: 'bg-transparent text-blue-600 hover:bg-blue-50',
  }

  return (
    <button className={`${base} ${styles[variant]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Procesando...
        </span>
      ) : children}
    </button>
  )
}
