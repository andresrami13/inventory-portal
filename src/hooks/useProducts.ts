import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Product } from '../types/database'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('name')

    if (error) {
      setError('No se pudieron cargar los productos')
    } else {
      setProducts(data ?? [])
    }
    setLoading(false)
  }

  return { products, loading, error, refetch: fetchProducts }
}
