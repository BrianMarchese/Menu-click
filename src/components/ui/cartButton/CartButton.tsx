'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { FaShoppingCart } from 'react-icons/fa'

export const CartButton = () => {
  const { cart } = useCart()

  // Si no hay productos, no mostramos nada
  if (cart.length === 0) return null

  return (
    <Link
        href="/carrito"
        className="ml-auto group relative inline-flex w-fit items-center gap-2.5 sm:gap-3 rounded-2xl border border-indigo-400/40 from-indigo-950/80 via-indigo-900/60 to-slate-900/80 px-3 py-1.5 sm:px-4 sm:py-2 text-slate-100 shadow-lg shadow-indigo-900/20 backdrop-blur-md transition-all duration-300 hover:border-indigo-400/80 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-95"
    >
        {/* Contenedor del Ícono con Badge flotante */}
        <div className="relative flex items-center justify-center">
            <FaShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-200 transition-transform duration-300 group-hover:scale-110" />

            {/* Burbuja con el número de productos */}
            <span className="absolute -top-2.5 -right-2.5 sm:-top-3 sm:-right-3 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-indigo-400 text-[10px] sm:text-[11px] font-black text-slate-950 shadow-md ring-2 ring-slate-950 animate-pulse">
                {cart.length}
            </span>
        </div>
    </Link>
    
  )
}