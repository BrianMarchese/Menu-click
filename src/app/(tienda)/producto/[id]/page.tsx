import { supabase } from '@/lib/supabase'
import { Product } from '@/interfaces'
import { notFound } from 'next/navigation'
import { ProductCustomizer } from '@/components'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProductoPage({ params }: PageProps) {
  // 1. Obtengo el id de la URL
  const { id } = await params

  // 2. Busco el producto en Supabase
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  // Si no existe o hay error, mostramos la página 404
  if (error || !product) {
    return notFound()
  }

  // 3. Renderizamos el componente pasándole el producto obtenido
  return <ProductCustomizer product={product as Product} />
}