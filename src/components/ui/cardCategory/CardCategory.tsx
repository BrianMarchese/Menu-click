'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Product } from '@/interfaces'
import { CiDiscount1 } from 'react-icons/ci'

// Definimos las categorías exactas de nuestra base de datos
// Tus categorías exclusivas con imágenes de alta calidad
const CATEGORIAS = [
  {
    id: 'todas',
    label: 'TODAS',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
  },
  {
    id: 'burgers',
    label: 'BURGERS',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
  },
  {
    id: 'papas',
    label: 'PAPAS',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800',
  },
  {
    id: 'bebidas',
    label: 'BEBIDAS',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800',
  },
    {
    id: 'rebozados',
    label: 'REBOZADOS',
    image: 'https://images.unsplash.com/photo-1550513008-8cd1a9b590c8?q=80&w=687?w=800',
  },
]

export const CardCategory = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('todas')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_available', true)
          .order('id', { ascending: true })

        if (error) throw error
        if (data) setProducts(data as Product[])
      } catch (err) {
        console.error('Error cargando productos:', err)
        setError('No se pudieron cargar los productos. Intentá refrescar.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts =
    activeCategory === 'todas'
      ? products
      : products.filter(
          (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
        )

  return (
    <div className="mx-auto max-w-7xl p-3">
      <div className="bg-emerald-100 text-green-500 rounded-full flex items-center justify-center gap-2 py-2 md:w-2xl mx-auto">
        <CiDiscount1 size={28} />
        <span>20% OFF abonando en efectivo</span>
      </div>
      {/* SECCIÓN CATEGORÍAS */}
      <div className="mb-10">
        <h2 className="text-xl font-black uppercase tracking-wider text-indigo-500 mb-4 flex items-center gap-2 mt-10">
          <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
          Categorías
        </h2>

        {/* Tarjetas de Categoría con la nueva paleta */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
          {CATEGORIAS.map((cat) => {
            const isActive = activeCategory === cat.id

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`group relative h-28 sm:h-36 w-full overflow-hidden rounded-2xl border transition-all duration-300 active:scale-95 ${
                  isActive
                    ? 'border-indigo-400 bg-indigo-800 shadow-lg shadow-indigo-800/40 ring-2 ring-indigo-400/50'
                    : 'border-blue-800/80 bg-blue-800/30 hover:border-indigo-400/50'
                }`}
              >
                {/* Imagen de fondo */}
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110 brightness-60"
                  loading="eager"
                />

                {/* Layer oscuro para legibilidad */}
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    isActive
                      ? ' from-indigo-950/90 via-indigo-950/70 to-indigo-950/40'
                      : ' from-black/85 via-black/60 to-black/30 group-hover:opacity-80'
                  }`}
                />

                {/* Nombre de la categoría */}
                <div className="absolute inset-0 flex items-center justify-center p-2 text-center">
                  <span
                    className={`text-base sm:text-lg font-black uppercase tracking-wider transition-colors duration-200 ${
                      isActive
                        ? 'text-indigo-400 drop-shadow-md'
                        : 'text-slate-200 group-hover:text-indigo-400'
                    }`}
                  >
                    {cat.label}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* TÍTULO DE LISTADO */}
      <div className="mb-6 flex items-center justify-between border-b border-blue-800/60 pb-4">
        <h3 className="text-2xl font-extrabold text-indigo-500 capitalize">
          {activeCategory === 'todas' ? 'Todos los productos' : activeCategory}
        </h3>
      </div>

      {/* ESTADO DE CARGA */}
      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-72 animate-pulse rounded-2xl border border-blue-800 bg-indigo-800/20"
            />
          ))}
        </div>
      )}

      {/* MENSAJE DE ERROR */}
      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-400">
          {error}
        </div>
      )}

      {/* GRILLA DE PRODUCTOS */}
      {!loading && !error && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/producto/${product.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-blue-800/80 bg-indigo-800/30 backdrop-blur-md transition hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-800/20"
            >
              {/* Imagen del Producto */}
              <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                <Image
                  src={
                    product.image_url ||
                    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800'
                  }
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="eager"
                />
                <span className="absolute top-3 left-3 rounded-lg bg-indigo-800/90 border border-indigo-400/30 px-2.5 py-1 text-[10px] font-extrabold tracking-wider uppercase text-indigo-200 backdrop-blur-xs">
                  {product.category}
                </span>
              </div>

              {/* Información */}
              <div className="flex flex-1 flex-col p-5">
                <h4 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition">
                  {product.name}
                </h4>
                <p className="mt-1 flex-1 text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {product.description || 'Sin descripción disponible.'}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-blue-800/60 pt-4">
                  <span className="text-xl font-black text-indigo-400">
                    ${product.price}
                  </span>

                  <span className="rounded-xl bg-indigo-800 px-3.5 py-1.5 text-xs font-bold text-slate-100 border border-indigo-400/40 group-hover:bg-indigo-400 group-hover:text-slate-950 transition">
                    Ver opciones
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* SIN RESULTADOS */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="my-12 text-center py-10 rounded-2xl border border-blue-800 bg-indigo-800/20">
          <p className="text-base font-semibold text-slate-400">
            No hay productos cargados en &quot;{activeCategory}&quot;.
          </p>
        </div>
      )}
    </div>
  )
}