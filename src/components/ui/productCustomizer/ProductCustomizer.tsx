'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  FiArrowLeft,
  FiChevronDown,
  FiChevronUp,
  FiPlus,
  FiMinus,
} from 'react-icons/fi'
import { Product, CartItem, ExtraOption } from '@/interfaces'
import { useCart } from '@/context/CartContext'

// Opciones exclusivas para la categoría PAPAS (Selección única con Radio Buttons)
const TOPPINGS_PAPAS = [
  { id: 'solas', name: 'Papas Solas', price: 0 },
  { id: 'cheddar', name: 'Con Cheddar', price: 1000 },
  { id: 'cheddar_panceta', name: 'Con Cheddar y Panceta', price: 1800 },
  { id: 'cheddar_panceta_verdeo', name: 'Con Cheddar, Panceta y Verdeo', price: 2300 },
]

// Extras exclusivos para la categoría BURGERS (Selección múltiple con Checkboxes)
const EXTRAS_BURGER: ExtraOption[] = [
  { id: 'medallon_extra', name: 'Medallón de Carne Extra', price: 3000 },
  { id: 'cheddar_extra', name: 'Cheddar Extra', price: 1000 },
  { id: 'panceta_extra', name: 'Panceta Extra', price: 1500 },
]

interface ProductCustomizerProps {
  product: Product
}

export const ProductCustomizer= ({ product }: ProductCustomizerProps) => {
  const router = useRouter()
  const { addToCart } = useCart()

  // Estados para acordeones
  const [isOpen, setIsOpen] = useState(true)

  // Selección según la categoría
  const [selectedToppingPapa, setSelectedToppingPapa] = useState<string>('solas')
  const [selectedExtrasBurger, setSelectedExtrasBurger] = useState<ExtraOption[]>([])
  const [quantity, setQuantity] = useState(1)

  const isBurger = product.category.toLowerCase() === 'burgers'
  const isPapas = product.category.toLowerCase() === 'papas'

  // Handler para tildar/destildar extras en las Burgers
  const handleToggleExtraBurger = (extra: ExtraOption) => {
    setSelectedExtrasBurger((prev) =>
      prev.some((e) => e.id === extra.id)
        ? prev.filter((e) => e.id !== extra.id)
        : [...prev, extra]
    )
  }

  // CÁLCULO DE PRECIOS
  const papaToppingPrice = isPapas
    ? TOPPINGS_PAPAS.find((p) => p.id === selectedToppingPapa)?.price || 0
    : 0

  const burgerExtrasPrice = isBurger
    ? selectedExtrasBurger.reduce((sum, item) => sum + item.price, 0)
    : 0

  const unitPrice = product.price + papaToppingPrice + burgerExtrasPrice
  const totalPrice = unitPrice * quantity

  // Guardar ítem para la orden
  const handleAddToCart = () => {
    const toppingElegido = TOPPINGS_PAPAS.find((p) => p.id === selectedToppingPapa)

    const item: CartItem = {
      product,
      quantity,
      selectedPapa: isPapas && selectedToppingPapa !== 'solas' ? toppingElegido?.name : undefined,
      selectedExtras: isBurger ? selectedExtrasBurger : [],
      subtotal: totalPrice,
    }

    addToCart(item) // <-- Guarda en el estado global
    router.push('/carrito') // <-- Redirige directo al carrito
  }

  return (
    <div className="relative min-h-screen bg-[#dce5fa] text-slate-800 flex flex-col justify-between">
      
      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 overflow-y-auto pb-28">
        
        { /* Cabecera */}
        {product.image_url ? (
          <div className="relative h-28 sm:h-52 w-full">
            <Image
              src={product.image_url || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            <button
              onClick={() => router.back()}
              className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-800/80 text-slate-100 shadow backdrop-blur-sm transition hover:bg-indigo-800"
            >
              <FiArrowLeft className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="p-4 pb-0">
            <button
              onClick={() => router.back()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-800/80 text-slate-100 shadow-sm"
            >
              <FiArrowLeft className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* DETALLE DEL PRODUCTO */}
        <div className="px-5 pt-3 max-w-2xl mx-auto">
          <h1 className="text-2xl font-black uppercase tracking-wide text-[#233554]">
            {product.name}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#3d4a60] leading-snug">
            {product.description || 'Sin descripción disponible.'}
          </p>
          
          <div className="mt-2 text-2xl font-black text-[#3730a3]">
            ${product.price.toLocaleString('es-AR')}
          </div>

          {/* OPCIONES SI ES PAPAS */}
          {isPapas && (
            <div className="mt-4">
              <h2 className="text-lg font-bold text-[#233554]">Personalizá tus Papas</h2>
              <p className="text-xs text-[#404a5b]">Elegí el topping que más te guste</p>

              <div className="mt-3 overflow-hidden rounded-2xl border border-indigo-200/70 shadow-sm">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex w-full items-center justify-between p-3.5 bg-[#121624] text-white text-left transition"
                >
                  <div>
                    <span className="text-xs font-black tracking-wider uppercase block text-slate-200">
                      Toppings
                    </span>
                    <span className="text-xs text-indigo-300">Seleccioná una opción</span>
                  </div>
                  {isOpen ? (
                    <FiChevronUp className="h-4 w-4 text-slate-200" />
                  ) : (
                    <FiChevronDown className="h-4 w-4 text-slate-200" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-3.5 space-y-3 bg-[#f8faff]">
                    {TOPPINGS_PAPAS.map((topping) => (
                      <label
                        key={topping.id}
                        className="flex items-center justify-between cursor-pointer py-0.5"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="topping_papas"
                            checked={selectedToppingPapa === topping.id}
                            onChange={() => setSelectedToppingPapa(topping.id)}
                            className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-0"
                          />
                          <span className="text-sm font-semibold text-slate-800">
                            {topping.name}
                          </span>
                        </div>
                        {topping.price > 0 && (
                          <span className="text-sm font-bold text-[#4f27f7]">
                            +${topping.price}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* OPCIONES SI ES BURGER */}
          {isBurger && (
            <div className="mt-4">
              <h2 className="text-lg font-bold text-[#233554]">Personalizá tu Hamburguesa</h2>
              <p className="text-xs text-[#404a5b]">Sumale más potencia a tu bajón.</p>

              <div className="mt-3 overflow-hidden rounded-2xl border border-indigo-200/70 shadow-sm">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex w-full items-center justify-between p-3.5 bg-[#121624] text-white text-left transition"
                >
                  <div>
                    <span className="text-xs font-black tracking-wider uppercase block text-slate-200">
                      Extras Adicionales
                    </span>
                    <span className="text-xs text-indigo-300">Podés elegir los que quieras</span>
                  </div>
                  {isOpen ? (
                    <FiChevronUp className="h-4 w-4 text-slate-300" />
                  ) : (
                    <FiChevronDown className="h-4 w-4 text-slate-300" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-3.5 space-y-3 bg-[#f8faff]">
                    {EXTRAS_BURGER.map((extra) => {
                      const isChecked = selectedExtrasBurger.some((e) => e.id === extra.id)
                      return (
                        <label
                          key={extra.id}
                          className="flex items-center justify-between cursor-pointer py-0.5"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleExtraBurger(extra)}
                              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-0"
                            />
                            <span className="text-sm font-semibold text-slate-800">
                              {extra.name}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-[#4f27f7]">
                            +${extra.price}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-2 py-4">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          
          {/* Contador de cantidad */}
          <div className="flex items-center rounded-xl border border-indigo-200 bg-indigo-50/40 px-2 py-1">
            <button
              onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
              className="p-1 text-indigo-500 hover:cursor-pointer"
            >
              <FiMinus className="h-3.5 w-3.5" />
            </button>
            <span className="w-7 text-center text-sm font-bold text-slate-800">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-1 text-indigo-500 transition hover:cursor-pointer"
            >
              <FiPlus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Precio total */}
          <span className="text-2xl font-black text-slate-800 tracking-tight">
            ${totalPrice.toLocaleString('es-AR')}
          </span>

          {/* Botón agregar */}
          <button
            onClick={handleAddToCart}
            className="rounded-xl bg-[#5227ff] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-indigo-500/20 transition hover:bg-[#431ce0] hover:cursor-pointer"
          >
            Agregar al pedido
          </button>

        </div>
      </div>

    </div>
  )
}