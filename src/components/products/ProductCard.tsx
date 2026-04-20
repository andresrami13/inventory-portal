import type { Product } from '../../types/database'
import { useCartStore } from '../../store/cart.store'
import { toast } from '../../store/toast.store'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const cartItem = useCartStore((s) => s.items.find((i) => i.product.id === product.id))
  const quantityInCart = cartItem?.quantity ?? 0

  function handleImageClick() {
    if (product.stock === 0) return
    addItem(product)
    toast.success(`${product.name} agregado`)
  }

  return (
    <div className="bg-white rounded-2xl p-1 shadow-sm border border-purple-50 flex flex-col group">
      {/* Image — clickeable para agregar al carrito */}
      <div
        onClick={handleImageClick}
        role="button"
        aria-label={`Agregar ${product.name} al carrito`}
        className={`relative aspect-square rounded-xl overflow-hidden bg-purple-50 transition-transform duration-200
          ${product.stock > 0 ? 'cursor-pointer active:scale-95' : 'cursor-not-allowed opacity-60'}`}
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-purple-200">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7" />
            </svg>
          </div>
        )}

        {/* Badge de cantidad flotante */}
        {quantityInCart > 0 && (
          <div className="absolute top-3 right-3 bg-purple-600/90 backdrop-blur-sm text-white text-xl font-bold w-10 h-10 flex items-center justify-center rounded-full shadow-md border border-purple-400/30">
            {quantityInCart}
          </div>
        )}

        {/* Overlay de press */}
        <div className="absolute inset-0 bg-purple-900/0 group-active:bg-purple-900/10 transition-colors pointer-events-none" />

        {/* Badge sin stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <span className="text-xs font-semibold text-red-500 bg-white px-2 py-1 rounded-full shadow-sm">
              Sin stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="pt-3 px-1 flex flex-col flex-grow">
        <h3 className="font-semibold text-sm text-purple-900 leading-tight line-clamp-1">{product.name}</h3>
        {product.description && (
          <p className="text-xs text-purple-400 mt-0.5 line-clamp-1">{product.description}</p>
        )}
        <div className="mt-auto pt-2">
          <span className="font-bold text-sm text-purple-700">${product.price.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
