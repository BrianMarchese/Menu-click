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
    <div className="relative min-h-screen bg-slate-900 text-slate-100">
      
      {/* HEADER CON IMAGEN */}
      <div className="relative h-64 sm:h-80 w-full">
        <Image
          src={
            product.image_url ||
            'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800'
          }
          alt={product.name}
          fill
          sizes="64px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 from-black/60 via-transparent to-slate-950" />

        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-800/80 text-slate-100 backdrop-blur-md transition hover:bg-indigo-800 border border-indigo-400/30"
        >
          <FiArrowLeft className="h-5 w-5" />
        </button>
      </div>

      {/* DETALLE DEL PRODUCTO */}
      <div className="px-5 pt-2 pb-32 max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-slate-100">
          {product.name}
        </h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          {product.description || 'Sin descripción disponible.'}
        </p>
        <div className="mt-4 text-2xl font-black text-indigo-400">
          ${product.price}
        </div>

        {/* OPCIONES SI ES PAPAS */}
        {isPapas && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-slate-100">Personalizá tus Papas</h2>
            <p className="text-xs text-slate-400 mt-0.5">Elegí el topping que más te guste</p>

            <div className="mt-4 overflow-hidden rounded-2xl border border-blue-800/80 bg-indigo-800/20">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between p-4 text-left font-bold"
              >
                <div>
                  <span className="text-xs font-black tracking-wider text-indigo-400 uppercase block">
                    Toppings
                  </span>
                  <span className="text-xs text-slate-400">Seleccioná una opción</span>
                </div>
                {isOpen ? (
                  <FiChevronUp className="h-5 w-5 text-indigo-400" />
                ) : (
                  <FiChevronDown className="h-5 w-5 text-indigo-400" />
                )}
              </button>

              {isOpen && (
                <div className="border-t border-blue-800/60 p-4 space-y-3 bg-slate-900/40">
                  {TOPPINGS_PAPAS.map((topping) => (
                    <label
                      key={topping.id}
                      className="flex items-center justify-between cursor-pointer py-1.5"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="topping_papas"
                          checked={selectedToppingPapa === topping.id}
                          onChange={() => setSelectedToppingPapa(topping.id)}
                          className="h-5 w-5 border-blue-800 bg-slate-950 text-indigo-400 focus:ring-indigo-400"
                        />
                        <span className="text-sm font-semibold text-slate-200">
                          {topping.name}
                        </span>
                      </div>
                      {topping.price > 0 && (
                        <span className="text-sm font-bold text-indigo-400">
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
          <div className="mt-8">
            <h2 className="text-lg font-bold text-slate-100">Personalizá tu Hamburguesa</h2>
            <p className="text-xs text-slate-400 mt-0.5">Sumale más potencia a tu bajón.</p>

            <div className="mt-4 overflow-hidden rounded-2xl border border-blue-800/80 bg-indigo-800/20">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between p-4 text-left font-bold"
              >
                <div>
                  <span className="text-xs font-black tracking-wider text-indigo-400 uppercase block">
                    Extras Adicionales
                  </span>
                  <span className="text-xs text-slate-400">Podés elegir los que quieras</span>
                </div>
                {isOpen ? (
                  <FiChevronUp className="h-5 w-5 text-indigo-400" />
                ) : (
                  <FiChevronDown className="h-5 w-5 text-indigo-400" />
                )}
              </button>

              {isOpen && (
                <div className="border-t border-blue-800/60 p-4 space-y-3 bg-slate-900/40">
                  {EXTRAS_BURGER.map((extra) => {
                    const isChecked = selectedExtrasBurger.some(
                      (e) => e.id === extra.id
                    )
                    return (
                      <label
                        key={extra.id}
                        className="flex items-center justify-between cursor-pointer py-1"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleExtraBurger(extra)}
                            className="h-5 w-5 rounded border-blue-800 bg-slate-950 text-indigo-400 focus:ring-indigo-400"
                          />
                          <span className="text-sm font-semibold text-slate-200">
                            {extra.name}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-indigo-400">
                          +${extra.price}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-blue-800/80 bg-indigo-800/95 backdrop-blur-md py-4 px-5 shadow-2xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          
          {/* Contador de cantidad */}
          <div className="flex items-center rounded-xl bg-slate-950/80 border border-blue-800/80 p-1">
            <button
              onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
              className="rounded-lg p-2 text-slate-300 hover:bg-indigo-800 hover:text-white transition active:scale-95"
            >
              <FiMinus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-base font-bold text-slate-100">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="rounded-lg p-2 text-slate-300 hover:bg-indigo-800 hover:text-white transition active:scale-95"
            >
              <FiPlus className="h-4 w-4" />
            </button>
          </div>

          {/* Botón agregar */}
          <button
            onClick={handleAddToCart}
            className="flex-1 rounded-xl bg-indigo-400 py-3.5 px-5 font-bold text-slate-800 transition hover:bg-indigo-300 flex items-center justify-between active:scale-[0.98] shadow-lg shadow-indigo-400/20"
          >
            <span className="text-sm sm:text-base tracking-wider uppercase font-extrabold cursor-pointer">
              Agregar al pedido
            </span>
            <span className="text-base sm:text-lg font-black bg-slate-950/20 px-2.5 py-1 rounded-lg ml-2">
              ${totalPrice}
            </span>
          </button>
        </div>
      </div>

    </div>
  )
}