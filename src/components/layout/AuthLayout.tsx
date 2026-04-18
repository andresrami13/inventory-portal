interface Props {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export default function AuthLayout({ title, subtitle, children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-500 mt-1 text-sm">{subtitle}</p>}
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
