import { useCartStore } from '../../store/cart.store'
import { exportCartToExcel } from '../../lib/exportExcel'
import { useAuthStore } from '../../store/auth.store'
import { supabase } from '../../lib/supabase'
import { toast } from '../../store/toast.store'

interface Props {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: Props) {
  const { items, removeItem, updateQuantity, total, clear } = useCartStore()
  const profile = useAuthStore((s) => s.profile)

  async function handleExport() {
    try {
      await exportCartToExcel(items, profile?.full_name ?? 'Usuario')
      toast.success('Archivo Excel descargado')
    } catch {
      toast.error('No se pudo exportar el archivo')
      return
    }

    if (profile) {
      await supabase.from('audit_log').insert({
        user_id: profile.id,
        user_email: profile.email,
        action: 'export',
        entity: 'cart',
        detail: { item_count: items.length, total: total() },
      })
    }
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-30 flex flex-col shadow-xl transition-transform duration-300
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
        aria-label="Carrito"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-purple-100">
          <h2 className="font-semibold text-purple-900 text-lg">Mi carrito</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-400 hover:bg-purple-50 active:bg-purple-100"
            aria-label="Cerrar carrito"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-purple-300">
              <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm">El carrito está vacío</p>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-3 items-start bg-purple-50 rounded-xl p-3">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 bg-purple-100 rounded-lg flex-shrink-0 flex items-center justify-center text-purple-300">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-purple-900 text-sm truncate">{product.name}</p>
                  <p className="text-purple-600 text-sm font-semibold">${product.price.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-purple-200 flex items-center justify-center text-purple-700 font-bold active:bg-purple-50"
                      aria-label="Reducir cantidad"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium w-5 text-center text-purple-900">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-purple-200 flex items-center justify-center text-purple-700 font-bold active:bg-purple-50"
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(product.id)}
                  className="p-1 text-purple-300 hover:text-red-500 active:text-red-600 mt-0.5"
                  aria-label="Eliminar del carrito"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-4 py-4 border-t border-purple-100 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-purple-600 font-medium">Total</span>
              <span className="text-xl font-bold text-purple-900">${total().toLocaleString()}</span>
            </div>
            <button
              onClick={handleExport}
              className="w-full py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exportar a Excel
            </button>
            <button
              onClick={clear}
              className="w-full py-2 text-sm text-purple-400 hover:text-red-500 transition"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
