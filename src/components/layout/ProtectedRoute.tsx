import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'

interface Props {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return <>{children}</>
}
