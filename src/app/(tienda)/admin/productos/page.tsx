'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Product } from '@/interfaces'
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiX,
  FiSearch,
  FiRefreshCw,
  FiCheck,
  FiEyeOff,
  FiUploadCloud,
  FiDollarSign,
} from 'react-icons/fi'

export default function AdminProductosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('todos')

  // Estado del Modal (Crear / Editar)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [saving, setSaving] = useState<boolean>(false)

  // Campos del Formulario
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [price, setPrice] = useState<string>('')
  const [category, setCategory] = useState<string>('burgers')
  const [isAvailable, setIsAvailable] = useState<boolean>(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Cargar productos desde Supabase
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true })

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      console.error('Error al cargar productos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Abrir Modal para CREAR
  const handleOpenCreateModal = () => {
    setEditingProduct(null)
    setName('')
    setDescription('')
    setPrice('')
    setCategory('burgers')
    setIsAvailable(true)
    setImageFile(null)
    setImagePreview(null)
    setIsModalOpen(true)
  }

  // Abrir Modal para EDITAR
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product)
    setName(product.name)
    setDescription(product.description || '')
    setPrice(product.price.toString())
    setCategory(product.category)
    setIsAvailable(product.is_available)
    setImageFile(null)
    setImagePreview(product.image_url)
    setIsModalOpen(true)
  }

  // Subir imagen a Supabase Storage Bucket 'products'
  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `items/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('products').getPublicUrl(filePath)
    return data.publicUrl
  }

  // GUARDAR (Crear o Modificar)
  const handleSaveProduct = async () => {
    if (!name.trim() || !price || Number(price) <= 0) {
      alert('Por favor completá el nombre y un precio válido.')
      return
    }

    try {
      setSaving(true)

      let finalImageUrl = editingProduct ? editingProduct.image_url : ''

      // Si seleccionó una nueva foto, la subimos
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile)
      }

      if (editingProduct) {
        // ACTUALIZAR EXISTENTE
        const { error } = await supabase
          .from('products')
          .update({
            name,
            description,
            price: Number(price),
            category,
            is_available: isAvailable,
            image_url: finalImageUrl,
          })
          .eq('id', editingProduct.id)

        if (error) throw error
      } else {
        // CREAR NUEVO
        const { error } = await supabase.from('products').insert({
          name,
          description,
          price: Number(price),
          category,
          is_available: isAvailable,
          image_url: finalImageUrl,
        })

        if (error) throw error
      }

      setIsModalOpen(false)
      fetchProducts()
    } catch (err) {
      console.error('Error al guardar producto:', err)
      alert('Hubo un error al guardar el producto. Verificá que exista el bucket publico "products" en Supabase Storage.')
    } finally {
      setSaving(false)
    }
  }

  // CAMBIAR DISPONIBILIDAD (STOCK RÁPIDO)
  const handleToggleAvailability = async (product: Product) => {
    try {
      const newStatus = !product.is_available
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_available: newStatus } : p))
      )

      const { error } = await supabase
        .from('products')
        .update({ is_available: newStatus })
        .eq('id', product.id)

      if (error) {
        fetchProducts() // Revertir si hubo error
        throw error
      }
    } catch (err) {
      console.error('Error al cambiar disponibilidad:', err)
    }
  }

  // ELIMINAR PRODUCTO
  const handleDeleteProduct = async (id: number) => {
    if (!confirm('¿Estás seguro de que querés eliminar este producto?')) return

    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error('Error al eliminar producto:', err)
      alert('No se pudo eliminar el producto.')
    }
  }

  // Filtrado de productos por búsqueda y categoría
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      categoryFilter === 'todos' || p.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-indigo-300/30 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-6xl">
        
        {/* HEADER Y BOTÓN NUEVO */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-slate-600/60">
              Menú de Productos
            </h1>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-400 px-5 py-3 font-black text-slate-700 uppercase tracking-wider shadow-lg shadow-indigo-400/20 hover:bg-indigo-500 transition active:scale-95"
          >
            <FiPlus className="h-5 w-5" />
            <span>Nuevo Producto</span>
          </button>
        </div>

        {/* FILTROS Y BUSCADOR */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Pestañas de Categoría */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['todos', 'burgers', 'papas', 'bebidas'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-bold uppercase transition ${
                  categoryFilter === cat
                    ? 'bg-indigo-800 text-slate-100 border border-indigo-400/50'
                    : 'bg-slate-900 text-slate-400 border border-blue-800/40 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Buscador */}
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-blue-800/80 bg-indigo-800/20 py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-100 focus:border-indigo-400 focus:outline-none"
            />
          </div>
        </div>

        {/* GRID DE PRODUCTOS */}
        {loading ? (
          <div className="flex py-20 justify-center items-center text-slate-500 gap-3">
            <FiRefreshCw className="animate-spin h-6 w-6 text-indigo-500" />
            <span className="text-sm font-semibold">Cargando catálogo...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-blue-800/80 bg-indigo-800/30 p-12 text-center text-slate-200">
            <p className="text-base font-bold">No hay productos en esta sección.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-4 backdrop-blur-md transition-all duration-300 ${
                  product.is_available
                    ? 'border-blue-800/80 bg-indigo-800/20'
                    : 'border-red-900/40 bg-slate-900/50 opacity-60'
                }`}
              >
                <div>
                  <div className="relative mb-3 h-40 w-full overflow-hidden rounded-xl bg-slate-950 border border-blue-800/40">
                    <Image
                      src={
                        product.image_url ||
                        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800'
                      }
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw"
                      loading='eager'
                      className="object-cover"
                    />

                    {/* Badge Categoría */}
                    <span className="absolute top-2 left-2 rounded-lg bg-indigo-100/80 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-indigo-600 border border-blue-800/60 backdrop-blur-md">
                      {product.category}
                    </span>

                    {/* Toggle de Disponibilidad Rápida */}
                    <button
                      onClick={() => handleToggleAvailability(product)}
                      className={`absolute top-2 right-2 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-bold transition backdrop-blur-md border ${
                        product.is_available
                          ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/40'
                          : 'bg-red-500/20 text-red-400 border-red-500/40'
                      }`}
                    >
                      {product.is_available ? <FiCheck /> : <FiEyeOff />}
                      {product.is_available ? 'Disponible' : 'No disponible'}
                    </button>
                  </div>

                  {/* Nombre y Descripción */}
                  <h3 className="text-base font-bold text-[#333435]">{product.name}</h3>
                  <p className="mt-1 text-sm text-[#191c23] line-clamp-2">
                    {product.description || 'Sin descripción'}
                  </p>
                </div>

                {/* Precio y Acciones */}
                <div className="mt-4 flex items-center justify-between border-t border-blue-800/60 pt-3">
                  <span className="text-lg font-black text-indigo-800">
                    ${product.price.toLocaleString('es-AR')}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(product)}
                      className="rounded-xl border border-blue-800/80 bg-indigo-900/60 p-2 text-indigo-300 hover:bg-indigo-800 transition"
                      title="Editar producto"
                    >
                      <FiEdit className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="rounded-xl border border-red-900/40 bg-red-950/30 p-2 text-red-400 hover:bg-red-900/50 transition"
                      title="Eliminar producto"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* MODAL CREAR / EDITAR PRODUCTO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-indigo-400/30 bg-indigo-800/40 p-6 shadow-2xl space-y-5">
            
            {/* Botón Cerrar */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 rounded-full bg-slate-950 p-2 text-slate-400 hover:text-slate-100 transition border border-blue-800/60"
            >
              <FiX className="h-5 w-5" />
            </button>

            {/* Título */}
            <h2 className="text-xl font-black text-indigo-400 uppercase">
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>

            {/* FORMULARIO */}
            <div className="space-y-4">
              
              {/* Nombre */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Doble Bajonera VGG"
                  className="w-full rounded-xl border border-blue-800 bg-slate-950 p-3 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-400 focus:outline-none"
                />
              </div>

              {/* Categoría y Precio */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Categoría *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-blue-800 bg-slate-950 p-3 text-sm text-slate-100 focus:border-indigo-400 focus:outline-none"
                  >
                    <option value="burgers">Hamburguesas</option>
                    <option value="papas">Papas Fritas</option>
                    <option value="bebidas">Bebidas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Precio ($) *
                  </label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Ej: 12500"
                      className="w-full rounded-xl border border-blue-800 bg-slate-950 py-3 pl-8 pr-3 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Descripción
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ej: Doble carne 120g, doble cheddar, panceta crocante y salsa especial."
                  rows={3}
                  className="w-full rounded-xl border border-blue-800 bg-slate-950 p-3 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-400 focus:outline-none"
                />
              </div>

              {/* Adjuntar Imagen */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Imagen del Producto
                </label>
                
                {/* Previsualización */}
                {imagePreview && (
                  <div className="relative mb-2 h-32 w-full overflow-hidden rounded-xl border border-blue-800 bg-slate-950">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      sizes='64px'
                      className="object-cover"

                    />
                  </div>
                )}

                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-indigo-400/50 bg-indigo-900/50 py-3 text-xs font-bold text-indigo-400 hover:bg-indigo-800/20 transition">
                  <FiUploadCloud className="h-5 w-5" />
                  <span>
                    {imageFile ? imageFile.name : 'Seleccionar foto desde la galería'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0]
                        setImageFile(file)
                        setImagePreview(URL.createObjectURL(file))
                      }
                    }}
                  />
                </label>
              </div>

              {/* Estado de Disponibilidad */}
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="availableCheck"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="h-4 w-4 rounded border-blue-800 bg-slate-950 text-indigo-400 focus:ring-0"
                />
                <label htmlFor="availableCheck" className="text-xs font-bold text-slate-300">
                  Producto disponible para la venta
                </label>
              </div>

            </div>

            {/* BOTÓN GUARDAR */}
            <div className="pt-3">
              <button
                type="button"
                onClick={handleSaveProduct}
                disabled={saving}
                className="w-full rounded-xl bg-indigo-400 py-3.5 font-black uppercase text-slate-950 transition hover:bg-indigo-300 active:scale-[0.98] disabled:opacity-50"
              >
                {saving ? 'Guardando en Supabase...' : editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}