'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Order } from '@/interfaces'
import {
  FiClock,
  FiUser,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiShoppingBag,
  FiX,
  FiSearch,
  FiRefreshCw,
  FiTruck,
  FiPackage,
  FiPrinter,
} from 'react-icons/fi'
import { TicketComanda } from '@/components'



export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Cargar pedidos desde Supabase
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setOrders(data || [])
    } catch (err) {
      console.error('Error al cargar pedidos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Disparar Impresión
  const handlePrint = () => {
    window.print()
  }
  // Filtrado por buscador
  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase()
    return (
      order.client_name.toLowerCase().includes(query) ||
      order.order_number?.toString().includes(query) ||
      order.client_phone.includes(query)
    )
  })

  // Formateador de Fecha y Hora
  const formatDateTime = (isoDate: string) => {
    const date = new Date(isoDate)
    const formattedDate = date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    const formattedTime = date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    return { date: formattedDate, time: formattedTime }
  }

  return (
    <div className="min-h-screen bg-indigo-800/30 px-4 py-8 text-slate-100">
      <TicketComanda order={ selectedOrder } />
      <div className="mx-auto max-w-6xl">
        
        {/* HEADER Y BUSCADOR */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-slate-600/60">
              Gestión de Pedidos
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Buscador */}
            <div className="relative flex-1 sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="text"
                placeholder="Buscar cliente o #pedido..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-blue-800/80 bg-indigo-800/20 py-2.5 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-100 focus:border-indigo-400 focus:outline-none"
              />
            </div>

            {/* Botón Refrescar */}
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 rounded-xl border border-blue-800/80 bg-indigo-800/60 px-3.5 py-2.5 text-xs font-bold text-indigo-300 hover:bg-indigo-600/60 transition active:scale-95"
              title="Actualizar listado"
            >
              <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Actualizar</span>
            </button>
          </div>
        </div>

        {/* LISTADO DE PEDIDOS (RESUMEN) */}
        {loading ? (
          <div className="flex py-20 justify-center items-center text-slate-500 gap-3">
            <FiRefreshCw className="animate-spin h-6 w-6 text-indigo-500" />
            <span className="text-ms font-semibold">Cargando pedidos...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-blue-800/80 bg-indigo-800/10 p-12 text-center text-slate-200">
            <FiShoppingBag className="mx-auto mb-3 h-12 w-12 text-indigo-500/40" />
            <p className="text-base font-bold">No se encontraron pedidos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order) => {
              const { time } = formatDateTime(order.created_at)
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="group relative cursor-pointer rounded-2xl border border-blue-800/80 bg-indigo-800/40 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-indigo-400/80 hover:shadow-indigo-500/10 hover:scale-[1.01]"
                >
                  {/* Encabezado de la Tarjeta */}
                  <div className="flex items-center justify-between border-b border-blue-800/60 pb-3 mb-3">
                    <span className="font-black text-indigo-100 text-sm">
                      Pedido #{order.order_number}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-blue-800/60">
                      <FiClock className="text-indigo-300" />
                      {time} hs
                    </span>
                  </div>

                  {/* Cuerpo de la Tarjeta (Resumen) */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-100 text-sm">
                      <FiUser className="text-indigo-200 shrink-0" />
                      <span className="truncate">{order.client_name}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-100 pt-1">
                      <span className="flex items-center gap-1.5 font-medium">
                        {order.delivery_type === 'Envio' ? (
                          <FiTruck className="text-emerald-400" />
                        ) : (
                          <FiPackage className="text-amber-400" />
                        )}
                        {order.delivery_type === 'Envio' ? 'Envío' : 'Retira'}
                      </span>

                      <span className="flex items-center gap-1.5 font-medium">
                        <FiCreditCard className="text-indigo-200" />
                        {order.payment_method}
                      </span>
                    </div>
                  </div>

                  {/* Pie de la Tarjeta */}
                  <div className="mt-4 flex items-center justify-between border-t border-blue-800/60 pt-3">
                    <span className="text-[10px] uppercase font-bold text-slate-200">
                      Total:
                    </span>
                    <span className="text-base font-black text-slate-100">
                      ${order.total.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>

      {/* MODAL CON EL DETALLE COMPLETO DEL PEDIDO */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-indigo-400/30 bg-indigo-800/40 p-6 shadow-2xl space-y-6">
            
            {/* Botón Cerrar Modal */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute right-5 top-5 rounded-full bg-slate-950 p-2 text-slate-400 hover:text-slate-100 hover:bg-indigo-800/50 transition border border-blue-800/60"
            >
              <FiX className="h-5 w-5" />
            </button>

            {/* Encabezado del Modal */}
            <div className="border-b border-blue-800/80 pb-4 pr-10">
              <h2 className="text-xl font-black text-indigo-400 uppercase">
                Pedido #{selectedOrder.order_number}
              </h2>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                {formatDateTime(selectedOrder.created_at).date} a las{' '}
                {formatDateTime(selectedOrder.created_at).time} hs
              </p>
            </div>

            {/* Grid 2 Columnas con Datos de Cliente y Pago */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Datos del Cliente y Entrega */}
              <div className="rounded-2xl border border-blue-800/80 bg-indigo-800/20 p-4 space-y-2.5">
                <h3 className="text-xs font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
                  <FiUser /> Cliente y Entrega
                </h3>
                <div className="text-xs space-y-1.5 text-slate-200">
                  <p className="font-bold text-sm text-slate-100">{selectedOrder.client_name}</p>
                  <p className="flex items-center gap-2 text-slate-300">
                    <FiPhone className="text-indigo-400 shrink-0" />
                    <a href={`tel:${selectedOrder.client_phone}`} className="hover:underline">
                      {selectedOrder.client_phone}
                    </a>
                  </p>
                  <p className="flex items-start gap-2 text-slate-300">
                    <FiMapPin className="text-indigo-400 shrink-0 mt-0.5" />
                    <span>{selectedOrder.delivery_address}</span>
                  </p>
                </div>
              </div>

              {/* Datos de Pago */}
              <div className="rounded-2xl border border-blue-800/80 bg-indigo-800/20 p-4 space-y-2.5">
                <h3 className="text-xs font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
                  <FiCreditCard /> Pago y Modalidad
                </h3>
                <div className="text-xs space-y-1.5 text-slate-200">
                  <p className="flex justify-between">
                    <span className="text-slate-400">Modalidad:</span>
                    <span className="font-bold">{selectedOrder.delivery_type === 'Envio' ? 'Envío a Domicilio' : 'Retiro en Local'}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">Medio de Pago:</span>
                    <span className="font-bold text-emerald-400">{selectedOrder.payment_method}</span>
                  </p>
                  <p className="flex justify-between pt-2 border-t border-blue-800/40 font-bold text-sm">
                    <span>Total Cobrado:</span>
                    <span className="text-indigo-400">${selectedOrder.total.toLocaleString('es-AR')}</span>
                  </p>
                </div>
              </div>

            </div>

            {/* DETALLE DE PRODUCTOS */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-indigo-400 tracking-wider">
                Productos ({selectedOrder.items?.length || 0})
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {selectedOrder.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-2xl border border-blue-800/60 bg-indigo-950 p-3"
                  >
                    {/* Imagen Pequeña */}
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-900 border border-blue-800/40">
                      <Image
                        src={
                          item.product.image_url ||
                          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800'
                        }
                        alt={item.product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>

                    {/* Info Producto */}
                    <div className="flex-1 text-xs">
                      <div className="flex items-start justify-between">
                        <p className="font-bold text-slate-100 text-sm">
                          {item.quantity}x {item.product.name}
                        </p>
                        <span className="font-black text-indigo-400">
                          ${item.subtotal.toLocaleString('es-AR')}
                        </span>
                      </div>

                      {/* Papas o Toppings */}
                      {item.selectedPapa && (
                        <p className="text-[11px] text-indigo-300 font-medium mt-0.5">
                          ➕ Papas: {item.selectedPapa}
                        </p>
                      )}

                      {/* Extras de la Burger */}
                      {item.selectedExtras && item.selectedExtras.length > 0 && (
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          ➕ Extras: {item.selectedExtras.map((e) => e.name).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BOTÓN CERRAR */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              
              {/* 🖨️ BOTÓN IMPRIMIR COMANDA */}
              <button
                onClick={handlePrint}
                className="flex w-full sm:w-1/2 items-center justify-center gap-2 rounded-xl bg-indigo-500 py-3 font-black uppercase text-slate-950 transition hover:bg-indigo-400 active:scale-[0.98] shadow-lg shadow-indigo-500/20"
              >
                <FiPrinter className="h-4 w-4" />
                <span>Imprimir Comanda</span>
              </button>

              {/* BOTÓN CERRAR */}
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full sm:w-1/2 rounded-xl border border-blue-800/80 bg-indigo-800/40 py-3 font-black uppercase text-slate-200 transition hover:bg-indigo-800/80 hover:text-white active:scale-[0.98]"
              >
                Cerrar Detalle
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}