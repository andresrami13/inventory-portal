interface Props {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export default function AuthLayout({ title, subtitle, children }: Props) {
  return (
    <div className="min-h-screen bg-[#fcfaff] flex items-center justify-center px-10 py-16">
      <div className="w-full max-w-[420px] flex flex-col items-center gap-10">
        {/* Logo + título */}
        <div className="flex flex-col items-center text-center gap-5">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl shadow-md">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7" />
            </svg>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-purple-950 leading-tight">{title}</h1>
            {subtitle && <p className="text-purple-400 text-base leading-snug">{subtitle}</p>}
          </div>
        </div>

        {/* Formulario sin contenedor visible */}
        <div className="w-full flex flex-col gap-5">
          {children}
        </div>
      </div>
    </div>
  )
}
