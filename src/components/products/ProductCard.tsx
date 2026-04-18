import { useState } from 'react'
import type { Product } from '../../types/database'
import { useCartStore } from '../../store/cart.store'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const inCart = useCartStore((s) => s.items.some((i) => i.product.id === product.id))
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
      {/* Image */}
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <p className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{product.name}</p>
        {product.description && (
          <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-blue-600 font-bold text-base">${product.price.toLocaleString()}</span>
          {product.stock > 0 ? (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              Disponible
            </span>
          ) : (
            <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
              Sin stock
            </span>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition active:scale-95
            ${added
              ? 'bg-green-500 text-white'
              : inCart
              ? 'bg-blue-50 text-blue-600 border border-blue-200'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }
            disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed`}
        >
          {added ? '✓ Agregado' : inCart ? 'Agregar otro' : 'Agregar'}
        </button>
      </div>
    </div>
  )
}
