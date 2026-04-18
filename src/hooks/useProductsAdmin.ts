import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Product } from '../types/database'
import { useAuthStore } from '../store/auth.store'

export function useProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const profile = useAuthStore((s) => s.profile)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name')
    if (error) setError('No se pudieron cargar los productos')
    else setProducts(data ?? [])
    setLoading(false)
  }

  async function createProduct(
    values: Omit<Product, 'id' | 'created_at'>,
    imageFile: File | null
  ) {
    const image_url = imageFile ? await uploadImage(imageFile) : null
    const { error } = await supabase
      .from('products')
      .insert({ ...values, image_url: image_url ?? values.image_url })

    if (error) throw new Error('No se pudo crear el producto')
    await logAction('create', 'product', null, { name: values.name })
    await fetchAll()
  }

  async function updateProduct(
    id: string,
    values: Partial<Omit<Product, 'id' | 'created_at'>>,
    imageFile: File | null,
    oldImageUrl: string | null
  ) {
    let image_url = values.image_url ?? null

    if (imageFile) {
      if (oldImageUrl) await deleteImage(oldImageUrl)
      image_url = await uploadImage(imageFile)
    }

    const { error } = await supabase
      .from('products')
      .update({ ...values, image_url })
      .eq('id', id)

    if (error) throw new Error('No se pudo actualizar el producto')
    await logAction('update', 'product', id, { name: values.name ?? null })
    await fetchAll()
  }

  async function deleteProduct(id: string, imageUrl: string | null, name: string) {
    if (imageUrl) await deleteImage(imageUrl)
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw new Error('No se pudo eliminar el producto')
    await logAction('delete', 'product', id, { name })
    await fetchAll()
  }

  async function uploadImage(file: File): Promise<string> {
    const ext = file.name.split('.').pop()
    const filename = `${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage
      .from('product-images')
      .upload(filename, file, { upsert: false })
    if (error) throw new Error('No se pudo subir la imagen')
    const { data } = supabase.storage.from('product-images').getPublicUrl(filename)
    return data.publicUrl
  }

  async function deleteImage(url: string) {
    const filename = url.split('/').pop()
    if (filename) {
      await supabase.storage.from('product-images').remove([filename])
    }
  }

  async function logAction(action: string, entity: string, entityId: string | null, detail: Record<string, string | null>) {
    if (!profile) return
    await supabase.from('audit_log').insert({
      user_id: profile.id,
      user_email: profile.email,
      action,
      entity,
      entity_id: entityId,
      detail,
    })
  }

  return { products, loading, error, createProduct, updateProduct, deleteProduct, refetch: fetchAll }
}
