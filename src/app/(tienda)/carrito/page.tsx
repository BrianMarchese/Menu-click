'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { supabase } from '@/lib/supabase'
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

const WHATSAPP_NUMBER = '543412745522' // Número de WhatsApp del local

export default function CarritoPage() {
  const router = useRouter()
  const {
    cart,
    removeFromCart,
    updateQuantity,
    total,
    generalNotes,
    setGeneralNotes,
    clearCart,
  } = useCart()

  // Estado del flujo (1: Revisar Pedido, 2: Formulario de Datos)
  const [step, setStep] = useState<1 | 2>(1)
  const [loading, setLoading] = useState<boolean>(false)

  // Campos del Formulario
  const [clientName, setClientName] = useState<string>('')
  const [clientPhone, setClientPhone] = useState<string>('')
  const [locality, setLocality] = useState<string>('Villa Gobernador Gálvez')
  const [deliveryType, setDeliveryType] = useState<'Envio' | 'Retira'>('Envio')
  const [address, setAddress] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Transferencia'>('Efectivo')

  // Mensajes de error en validaciones
  const [formError, setFormError] = useState<string>('')

  // SI EL CARRITO ESTÁ VACÍO
  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-800/30 border border-indigo-400/20 text-indigo-400 text-3xl">
          🛒
        </div>
        <h2 className="text-2xl font-black text-slate-100 uppercase">
          Tu carrito está vacío
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          ¿Todavía no sabés qué pedir? Volvé al menú y armate un buen bajón.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-indigo-400 px-6 py-3 text-sm font-extrabold text-slate-950 uppercase tracking-wider transition hover:bg-indigo-300"
        >
          Ir al Menú
        </Link>
      </div>
    )
  }

  // ACCIÓN DE FORMULARIO (Sintaxis nativa de React 19 / Next.js 16)
  const handleFinalizeOrder = async () => {
    setFormError('')

    // Validaciones de entrada
    if (!clientName.trim()) {
      setFormError('Por favor ingresá tu nombre y apellido.')
      return
    }
    if (!clientPhone.trim()) {
      setFormError('Por favor ingresá tu número de teléfono.')
      return
    }
    if (deliveryType === 'Envio' && !address.trim()) {
      setFormError('Por favor ingresá tu dirección para el envío.')
      return
    }

    try {
      setLoading(true)

      // 1. Obtener Fecha y Hora actual
      const now = new Date()
      const formattedDate = now.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      const formattedTime = now.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
      })

      // 2. Cálculo del Descuento por Efectivo (20% OFF)
      const isCash = paymentMethod === 'Efectivo'
      const discountAmount = isCash ? total * 0.2 : 0
      const finalTotal = total - discountAmount

      // 3. Guardar la orden en Supabase y obtener el ID autogenerado
      const { data: insertedOrder, error: dbError } = await supabase
        .from('orders')
        .insert({
          client_name: clientName,
          client_phone: clientPhone,
          delivery_type: deliveryType,
          delivery_address:
            deliveryType === 'Envio'
              ? `${address} (${locality})`
              : 'Retira en local',
          payment_method: paymentMethod,
          total: finalTotal,
          items: cart,
        })
        .select('id')
        .single()

      if (dbError) {
        console.error('Error insertando orden en Supabase:', dbError)
      }

      const orderNumber = insertedOrder?.id ? `#${insertedOrder.id}` : '#PENDIENTE'

      // 4. Armar el mensaje para WhatsApp
      let msg = ` *CLUB DEL BAJON VGG - NUEVO PEDIDO* \n`
      msg += ` *N° de Pedido:* ${orderNumber}\n`
      msg += ` *Fecha:* ${formattedDate} - ${formattedTime} hs\n`
      msg += `------------------------------------------\n`
      msg += ` *Cliente:* ${clientName}\n`
      msg += ` *Teléfono:* ${clientPhone}\n`
      msg += ` *Localidad:* ${locality}\n`
      msg += ` *Entrega:* ${
        deliveryType === 'Envio' ? 'Envío a domicilio' : 'Retira en local'
      }\n`
      if (deliveryType === 'Envio') {
        msg += `*Dirección:* ${address}\n`
      }
      msg += ` *Pago:* ${paymentMethod}\n\n`

      msg += ` *DETALLE DEL PEDIDO:*\n`
      cart.forEach((item) => {
        msg += `• *${item.quantity}x ${item.product.name}* ($${item.subtotal.toLocaleString('es-AR')})\n`
        if (item.selectedPapa) {
          msg += `   └ Papas: ${item.selectedPapa}\n`
        }
        if (item.selectedExtras && item.selectedExtras.length > 0) {
          msg += `   └ Extras: ${item.selectedExtras.map((e) => e.name).join(', ')}\n`
        }
      })

      if (generalNotes.trim()) {
        msg += `\n *Aclaraciones:*\n"${generalNotes}"\n`
      }

      msg += `------------------------------------------\n`
      msg += ` *Subtotal:* $${total}\n\n`

      if (isCash) {
        msg += ` *Descuento Efectivo (20% OFF):* -$${discountAmount}\n\n`
      }
      msg += ` *TOTAL A PAGAR:* $${finalTotal}\n\n`
      msg += `Espero tu respuesta para confirmar mi pedido\n`

      // 5. Redirigir a WhatsApp
      const encodedMsg = encodeURIComponent(msg)
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`

      clearCart()
      window.location.href = whatsappUrl
    } catch (err) {
      console.error(err)
      setFormError('Hubo un problema al procesar la orden. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-32">
      
      {/* Botón Volver */}
      <button
        onClick={() => (step === 2 ? setStep(1) : router.push('/'))}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition"
      >
        <FiArrowLeft className="h-4 w-4" />
        {step === 2 ? 'Volver al detalle del pedido' : 'Seguir pidiendo'}
      </button>

      {/* Indicador de Pasos */}
      <div className="mb-8 flex items-center justify-between border-b border-blue-800/60 pb-4">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${
              step === 1
                ? 'bg-indigo-400 text-slate-950'
                : 'bg-indigo-800 text-slate-300'
            }`}
          >
            1
          </span>
          <span
            className={`text-sm font-bold ${
              step === 1 ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            Detalle del Pedido
          </span>
        </div>

        <div className="h-0.5 w-8 bg-blue-800" />

        <div className="flex items-center gap-2">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${
              step === 2
                ? 'bg-indigo-400 text-slate-950'
                : 'bg-indigo-800 text-slate-300'
            }`}
          >
            2
          </span>
          <span
            className={`text-sm font-bold ${
              step === 2 ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            Envío y Pago
          </span>
        </div>
      </div>

      {/* PASO 1: LISTADO DE PRODUCTOS Y NOTAS */}
      {step === 1 && (
        <div>
          <h1 className="text-2xl font-black uppercase text-slate-600 mb-4">
            Tu Pedido ({cart.length})
          </h1>

          {/* Lista de ítems */}
          <div className="space-y-4">
            {cart.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 rounded-2xl border border-blue-800/80 bg-indigo-800/20 p-4 backdrop-blur-md"
              >
                {/* Imagen del producto */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-900">
                  <Image
                    src={
                      item.product.image_url ||
                      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800'
                    }
                    alt={item.product.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                {/* Detalles del ítem */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="text-base font-bold text-slate-600">
                      {item.product.name}
                    </h3>
                    <button
                      onClick={() => removeFromCart(idx)}
                      className="text-slate-500 hover:text-red-400 transition p-1"
                      title="Eliminar producto"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Toppings / Extras */}
                  {item.selectedPapa && (
                    <p className="text-sm text-indigo-400 font-medium mt-0.5">
                      ➕ {item.selectedPapa}
                    </p>
                  )}
                  {item.selectedExtras && item.selectedExtras.length > 0 && (
                    <p className="text-sm text-slate-500 font-medium  mt-0.5">
                      ➕ {item.selectedExtras.map((e) => e.name).join(', ')}
                    </p>
                  )}

                  {/* Selector de cantidad y subtotal */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-lg bg-slate-950 border border-blue-800/80 p-0.5">
                      <button
                        onClick={() => updateQuantity(idx, item.quantity - 1)}
                        className="p-1 text-slate-300 hover:text-white"
                      >
                        <FiMinus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-slate-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(idx, item.quantity + 1)}
                        className="p-1 text-slate-300 hover:text-white"
                      >
                        <FiPlus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <span className="text-base font-black text-indigo-400">
                      ${item.subtotal}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Aclaraciones generales */}
          <div className="mt-6 rounded-2xl border border-blue-800/80 bg-indigo-800/20 p-4">
            <label className="block text-sm font-bold text-slate-600 mb-2">
              📝 Aclaraciones
            </label>
            <textarea
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              placeholder="Ej: Sin aderezos en las burgers, enviar mayonesa extra..."
              className="w-full rounded-xl border border-blue-800 bg-indigo-600/20 p-3 text-sm text-black placeholder-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              rows={3}
            />
          </div>

          {/* Subtotal y Botón Confirmar */}
          <div className="mt-8 border-t border-blue-800/60 pt-4">
            <div className="flex items-center justify-between text-xl font-black text-slate-600 mb-6">
              <span>Subtotal del Pedido:</span>
              <span className="text-indigo-400">${total}</span>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full rounded-xl bg-indigo-400 py-4 font-black uppercase text-slate-950 transition hover:bg-indigo-300 shadow-lg shadow-indigo-400/20 active:scale-[0.98]"
            >
              Confirmar Pedido
            </button>
          </div>
        </div>
      )}

      {/* PASO 2: FORMULARIO REACT 19 */}
      {step === 2 && (
        <form action={handleFinalizeOrder} className="space-y-6">
          <h1 className="text-2xl font-black uppercase text-slate-600">
            Datos de Entrega y Pago
          </h1>

          {/* Alerta de Error */}
          {formError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-400">
              {formError}
            </div>
          )}

          {/* 1. Datos del Cliente */}
          <div className="rounded-2xl border border-blue-800/80 bg-indigo-800/20 p-5 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-indigo-400">
              1. Tus Datos
            </h3>

            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">
                Nombre y Apellido *
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ej: Nicolás Gómez"
                className="w-full rounded-xl border border-blue-800 bg-indigo-800/20 p-3 text-sm text-black placeholder-slate-500 focus:border-indigo-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">
                Teléfono *
              </label>
              <input
                type="tel"
                required
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="Ej: 3412345678"
                className="w-full rounded-xl border border-blue-800 bg-indigo-800/20 p-3 text-sm text-black placeholder-slate-500 focus:border-indigo-400 focus:outline-none"
              />
            </div>
          </div>

          {/* 2. Forma de Entrega */}
          <div className="rounded-2xl border border-blue-800/80 bg-indigo-800/20 p-5 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-indigo-400">
              2. Forma de Entrega
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryType('Envio')}
                className={`p-3.5 rounded-xl border font-bold text-sm transition text-center ${
                  deliveryType === 'Envio'
                    ? 'border-indigo-400 bg-indigo-800 text-slate-100 ring-1 ring-indigo-400'
                    : 'border-blue-800/80 bg-indigo-900 text-slate-300'
                }`}
              >
                🛵 Envío a Domicilio
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('Retira')}
                className={`p-3.5 rounded-xl border font-bold text-sm transition text-center ${
                  deliveryType === 'Retira'
                    ? 'border-indigo-400 bg-indigo-800 text-slate-100 ring-1 ring-indigo-400'
                    : 'border-blue-800/80 bg-indigo-900 text-slate-300'
                }`}
              >
                🏃 Retiro en Local
              </button>
            </div>

            {deliveryType === 'Envio' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Localidad
                  </label>
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full rounded-xl border border-blue-800 bg-indigo-800/20 p-3 text-sm text-black focus:border-indigo-400 focus:outline-none"
                  >
                    <option value="Villa Gobernador Gálvez">
                      Villa Gobernador Gálvez
                    </option>
                    <option value="Rosario (Zona Sur)">
                      Rosario (Zona Sur)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Dirección Exacta (Calle y Número) *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej: Av. San Martín 1420, Dpto 2B"
                    className="w-full rounded-xl border border-blue-800 bg-indigo-800/20 p-3 text-sm text-black placeholder-slate-500 focus:border-indigo-400 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. Forma de Pago con Descuento */}
          <div className="rounded-2xl border border-blue-800/80 bg-indigo-800/20 p-5 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-indigo-400">
              3. Forma de Pago
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('Efectivo')}
                className={`p-3.5 rounded-xl border font-bold text-sm transition text-center relative ${
                  paymentMethod === 'Efectivo'
                    ? 'border-indigo-400 bg-indigo-800 text-slate-100 ring-1 ring-indigo-400'
                    : 'border-blue-800/80 bg-indigo-900 text-slate-300'
                }`}
              >
                💵 Efectivo
                <span className="block text-[10px] text-emerald-400 font-extrabold uppercase mt-0.5">
                  20% OFF
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Transferencia')}
                className={`p-3.5 rounded-xl border font-bold text-sm transition text-center ${
                  paymentMethod === 'Transferencia'
                    ? 'border-indigo-400 bg-indigo-800 text-slate-100 ring-1 ring-indigo-400'
                    : 'border-blue-800/80 bg-indigo-900 text-slate-300'
                }`}
              >
                📲 Transferencia
              </button>
            </div>
          </div>

          {/* Desglose de Precios Finales */}
          <div className="border-t border-blue-800/60 pt-4 space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Subtotal:</span>
              <span>${total}</span>
            </div>

            {paymentMethod === 'Efectivo' && (
              <div className="flex items-center justify-between text-sm font-bold text-emerald-400">
                <span>Descuento Efectivo (20% OFF):</span>
                <span>-${(total * 0.2)}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xl font-black text-slate-600 pt-2 border-t border-blue-800/40">
              <span>Total Final:</span>
              <span className="text-indigo-400">
                $
                {(paymentMethod === 'Efectivo'
                  ? total * 0.8
                  : total
                )}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-500 py-4 font-black uppercase text-slate-950 transition hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              <FaWhatsapp className="h-6 w-6" />
              <span>{loading ? 'Procesando...' : 'Pedir por WhatsApp'}</span>
            </button>
          </div>
        </form>
      )}

    </div>
  )
}