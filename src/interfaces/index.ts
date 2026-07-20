// 1. Interfaz de un Extra/Adicional (Cheddar, Bacon.)
export interface ExtraOption {
  id: string
  name: string
  price: number
}

// 2. Interfaz del Producto (Mapeo directo de la tabla 'products' de Supabase)
export interface Product {
  id: number
  created_at?: string
  name: string
  description: string | null
  price: number
  category: 'burgers' | 'papas' | 'bebidas' | 'rebozados' | string
  image_url: string | null
  is_available: boolean
}

// 3. Interfaz de un Ítem dentro del Carrito / Pedido (Producto + Elecciones)
export interface CartItem {
  product: Product
  quantity: number
  selectedPapa?: string        // Ej: 'PAPA CHICA CHEDDAR'
  removedIngredients?: string[]
  selectedExtras: ExtraOption[] // Array con los adicionales elegidos
  subtotal: number             // Precio calculado del ítem * cantidad
}

// 4. Interfaz de la Orden de Compra (Mapeo directo de la tabla 'orders')
export interface Order {
  id?: number
  created_at?: string
  client_name: string
  client_phone: string
  payment_method: 'Efectivo' | 'Transferencia'
  delivery_type: 'Envio' | 'Retira'
  delivery_address?: string | null
  total: number
  items: CartItem[] // Guardado como JSONB en Supabase
}