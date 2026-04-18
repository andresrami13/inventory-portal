import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Product } from '../../types/database'
import Input from '../ui/Input'
import Button from '../ui/Button'
import ImageUpload from './ImageUpload'

const schema = z.object({
  name: z.string().min(2, 'Ingresa el nombre del producto'),
  description: z.string().optional(),
  price: z.number({ error: 'Ingresa un precio válido' }).min(0, 'El precio no puede ser negativo'),
  stock: z.number({ error: 'Ingresa un stock válido' }).int().min(0, 'El stock no puede ser negativo'),
  active: z.boolean(),
})

type FormData = z.infer<typeof schema>

interface Props {
  open: boolean
  product?: Product | null
  onSave: (values: Omit<Product, 'id' | 'created_at'>, imageFile: File | null) => Promise<void>
  onClose: () => void
}

export default function ProductModal({ open, product, onSave, onClose }: Props) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageRemoved, setImageRemoved] = useState(false)
  const [serverError, setServerError] = useState('')
  const isEdit = !!product

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (open) {
      setImageFile(null)
      setImageRemoved(false)
      setServerError('')
      reset({
        name: product?.name ?? '',
        description: product?.description ?? '',
        price: product?.price ?? 0,
        stock: product?.stock ?? 0,
        active: product?.active ?? true,
      })
    }
  }, [open, product])

  async function onSubmit(data: FormData) {
    setServerError('')
    try {
      await onSave(
        {
          ...data,
          description: data.description || null,
          image_url: imageRemoved ? null : (product?.image_url ?? null),
        },
        imageFile
      )
      onClose()
    } catch (e) {
      setServerError(e instanceof Error ? e.message : 'Ocurrió un error')
    }
  }

  function handleImageChange(file: File | null) {
    setImageFile(file)
    if (!file) setImageRemoved(true)
    else setImageRemoved(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-white w-full max-w-lg rounded-t-2xl md:rounded-2xl shadow-xl max-h-[92svh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="font-semibold text-gray-900 text-lg">
            {isEdit ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100" aria-label="Cerrar">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 px-5 py-4 overflow-y-auto flex-1">
          <ImageUpload
            currentUrl={imageRemoved ? null : product?.image_url}
            onChange={handleImageChange}
          />

          <Input
            label="Nombre del producto"
            placeholder="Ej: Casco de seguridad"
            error={errors.name?.message}
            {...register('name')}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Descripción (opcional)</label>
            <textarea
              placeholder="Descripción breve del producto..."
              rows={2}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Precio"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="0.00"
              error={errors.price?.message}
              {...register('price', { valueAsNumber: true })}
            />
            <Input
              label="Stock"
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              placeholder="0"
              error={errors.stock?.message}
              {...register('stock', { valueAsNumber: true })}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input type="checkbox" className="w-5 h-5 rounded accent-blue-600" {...register('active')} />
            <span className="text-sm text-gray-700">Producto activo (visible en catálogo)</span>
          </label>

          {serverError && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 text-center">{serverError}</p>
          )}

          <div className="flex gap-3 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <Button type="submit" loading={isSubmitting} className="flex-1">
              {isEdit ? 'Guardar cambios' : 'Crear producto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
