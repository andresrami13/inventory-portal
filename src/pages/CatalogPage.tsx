import { useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import ProductCard from '../components/products/ProductCard'
import { useProducts } from '../hooks/useProducts'

export default function CatalogPage() {
  const { products, loading, error } = useProducts()
  const [search, setSearch] = useState('')

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AppLayout>
      <div className="px-4 pt-4 pb-2">
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="px-4 py-3">
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-16 text-red-500 text-sm">{error}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16 flex flex-col items-center gap-3 text-gray-400">
            <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7" />
            </svg>
            <p className="text-sm">
              {search ? 'No se encontraron productos' : 'No hay productos disponibles'}
            </p>
            {search && (
              <button onClick={() => setSearch('')} className="text-blue-500 text-sm">
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            <p className="text-xs text-gray-400 mb-3">{filtered.length} producto{filtered.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
