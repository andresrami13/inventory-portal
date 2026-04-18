import { useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import ProductModal from '../components/products/ProductModal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { useProductsAdmin } from '../hooks/useProductsAdmin'
import { toast } from '../store/toast.store'
import type { Product } from '../types/database'

export default function ProductsAdminPage() {
  const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProductsAdmin()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(product: Product) {
    setEditing(product)
    setModalOpen(true)
  }

  async function handleSave(values: Omit<Product, 'id' | 'created_at'>, imageFile: File | null) {
    if (editing) {
      await updateProduct(editing.id, values, imageFile, editing.image_url)
      toast.success('Producto actualizado')
    } else {
      await createProduct(values, imageFile)
      toast.success('Producto creado')
    }
  }

  async function handleDelete() {
    if (!deleting) return
    setDeleteLoading(true)
    try {
      await deleteProduct(deleting.id, deleting.image_url, deleting.name)
      toast.success('Producto eliminado')
    } catch {
      toast.error('No se pudo eliminar el producto')
    } finally {
      setDeleteLoading(false)
      setDeleting(null)
    }
  }

  return (
    <AppLayout>
      <div className="px-4 pt-4 pb-6">
        {/* Top bar */}
        <div className="flex gap-3 items-center mb-4">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 active:scale-95 transition flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Nuevo producto</span>
            <span className="sm:hidden">Nuevo</span>
          </button>
        </div>

        {/* States */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && <p className="text-center py-16 text-red-500 text-sm">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16 flex flex-col items-center gap-3 text-gray-400">
            <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7" />
            </svg>
            <p className="text-sm">{search ? 'No se encontraron productos' : 'No hay productos aún'}</p>
            {!search && (
              <button onClick={openCreate} className="text-blue-600 text-sm font-medium">
                Agregar el primero
              </button>
            )}
          </div>
        )}

        {/* Desktop table */}
        {!loading && filtered.length > 0 && (
          <>
            <p className="text-xs text-gray-400 mb-3">{filtered.length} producto{filtered.length !== 1 ? 's' : ''}</p>

            {/* Mobile: cards */}
            <div className="flex flex-col gap-3 md:hidden">
              {filtered.map((p) => (
                <MobileProductRow
                  key={p.id}
                  product={p}
                  onEdit={() => openEdit(p)}
                  onDelete={() => setDeleting(p)}
                />
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Producto</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Precio</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Stock</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">Estado</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((p) => (
                    <DesktopProductRow
                      key={p.id}
                      product={p}
                      onEdit={() => openEdit(p)}
                      onDelete={() => setDeleting(p)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <ProductModal
        open={modalOpen}
        product={editing}
        onSave={handleSave}
        onClose={() => setModalOpen(false)}
      />

      <ConfirmDialog
        open={!!deleting}
        title="¿Eliminar producto?"
        message={`Se eliminará "${deleting?.name}" de forma permanente. Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={deleteLoading}
      />
    </AppLayout>
  )
}

function MobileProductRow({ product, onEdit, onDelete }: { product: Product; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-3 flex gap-3">
      {product.image_url ? (
        <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
      ) : (
        <div className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center text-gray-300">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7" />
          </svg>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{product.name}</p>
        <p className="text-blue-600 font-semibold text-sm">${product.price.toLocaleString()}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">Stock: {product.stock}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${product.active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
            {product.active ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1 justify-center">
        <button onClick={onEdit} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" aria-label="Editar">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button onClick={onDelete} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" aria-label="Eliminar">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function DesktopProductRow({ product, onEdit, onDelete }: { product: Product; onEdit: () => void; onDelete: () => void }) {
  return (
    <tr className="hover:bg-gray-50 transition">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-300">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7" />
              </svg>
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{product.name}</p>
            {product.description && <p className="text-xs text-gray-500 truncate max-w-xs">{product.description}</p>}
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-right font-semibold text-blue-600">${product.price.toLocaleString()}</td>
      <td className="px-4 py-3 text-right text-gray-700">{product.stock}</td>
      <td className="px-4 py-3 text-center">
        <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${product.active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
          {product.active ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <button onClick={onEdit} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" aria-label="Editar">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={onDelete} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition" aria-label="Eliminar">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  )
}
