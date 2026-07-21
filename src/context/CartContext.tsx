'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem } from '@/interfaces'

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (index: number) => void
  updateQuantity: (index: number, newQuantity: number) => void
  clearCart: () => void
  total: number
  generalNotes: string
  setGeneralNotes: (notes: string) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [generalNotes, setGeneralNotes] = useState<string>('')

  // Cargar carrito guardado en localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('bajon_vgg_cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error('Error al leer el carrito local:', e)
      }
    }
  }, [])

  // Guardar en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem('bajon_vgg_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: CartItem) => {
    setCart(prev => [...prev, item])
  }

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index))
  }

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCart(prev =>
      prev.map((item, i) => {
        if (i === index) {
          const unitPrice = item.subtotal / item.quantity
          return {
            ...item,
            quantity: newQuantity,
            subtotal: unitPrice * newQuantity,
          }
        }
        return item
      })
    )
  }

  const clearCart = () => {
    setCart([])
    setGeneralNotes('')
    localStorage.removeItem('bajon_vgg_cart')
  }

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        generalNotes,
        setGeneralNotes,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider')
  }
  return context
}