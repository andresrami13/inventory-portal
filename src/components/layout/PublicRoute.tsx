import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'

interface Props {
  children: React.ReactNode
}

export default function PublicRoute({ children }: Props) {
  const { user, loading } = useAuthStore()

  if (loading) return null

  if (user) return <Navigate to="/" replace />

  return <>{children}</>
}
