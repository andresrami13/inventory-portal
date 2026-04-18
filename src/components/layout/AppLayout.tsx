import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useCartStore } from '../../store/cart.store'
import { useAuthStore } from '../../store/auth.store'
import { supabase } from '../../lib/supabase'
import CartDrawer from '../cart/CartDrawer'

interface Props {
  children: React.ReactNode
}

export default function AppLayout({ children }: Props) {
  const [cartOpen, setCartOpen] = useState(false)
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0))
  const profile = useAuthStore((s) => s.profile)

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-0.5 text-xs px-3 py-1 rounded-lg transition ${
      isActive ? 'text-blue-600' : 'text-gray-500'
    }`

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header desktop */}
      <header className="hidden md:flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900">Inventario</span>
        </div>

        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}>
            <IconCatalog />
            Catálogo
          </NavLink>
          <NavLink to="/productos" className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}>
            <IconProducts />
            Productos
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            aria-label="Ver carrito"
          >
            <IconCart />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>
          <span className="text-sm text-gray-500">{profile?.full_name}</span>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500 transition">
            Salir
          </button>
        </div>
      </header>

      {/* Header mobile */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-sm">Inventario</span>
        </div>
        <button
          onClick={() => setCartOpen(true)}
          className="relative p-2 rounded-lg text-gray-600 active:bg-gray-100"
          aria-label="Ver carrito"
        >
          <IconCart />
          {itemCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {itemCount > 9 ? '9+' : itemCount}
            </span>
          )}
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* Bottom nav mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-10">
        <NavLink to="/" end className={navLinkClass} style={{ flex: 1, paddingBlock: '10px' }}>
          <IconCatalog />
          Catálogo
        </NavLink>
        <NavLink to="/productos" className={navLinkClass} style={{ flex: 1, paddingBlock: '10px' }}>
          <IconProducts />
          Productos
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-0.5 text-xs px-3 text-gray-500"
          style={{ flex: 1, paddingBlock: '10px' }}
        >
          <IconLogout />
          Salir
        </button>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}

function IconCatalog() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  )
}

function IconProducts() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7" />
    </svg>
  )
}

function IconCart() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )
}

function IconLogout() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )
}
