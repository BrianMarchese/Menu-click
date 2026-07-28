import { Order } from '@/interfaces'

interface Props {
  order: Order | null
}

export const TicketComanda = ({ order }: Props) => {
  if (!order) return null

  const date = new Date(order.created_at)
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

  return (
    <div id="ticket-comanda" className="hidden print:block text-black bg-white p-2">
      {/* Encabezado */}
      <div className="text-center font-black border-b-2 border-black pb-2 mb-2 uppercase">
        <p className="text-base font-extrabold">CLUB DEL BAJÓN VGG</p>
        <p className="text-xs font-bold">N° PEDIDO: #{order.order_number || order.id}</p>
        <p className="text-[10px] font-normal">{formattedDate} - {formattedTime} hs</p>
      </div>

      {/* Datos Cliente y Entrega */}
      <div className="border-b border-black pb-2 mb-2 text-xs leading-tight space-y-1">
        <p><strong>CLIENTE:</strong> {order.client_name}</p>
        <p><strong>TEL:</strong> {order.client_phone}</p>
        <p><strong>MODALIDAD:</strong> {order.delivery_type === 'Envio' ? 'ENVÍO A DOMICILIO' : 'RETIRO EN LOCAL'}</p>
        {order.delivery_type === 'Envio' && order.delivery_address && (
          <p><strong>DIRECCIÓN:</strong> {order.delivery_address}</p>
        )}
        <p><strong>MEDIO DE PAGO:</strong> {order.payment_method.toUpperCase()}</p>
      </div>

      {/* Detalle de Productos para Cocina */}
      <div className="border-b-2 border-black pb-2 mb-2">
        <p className="font-black text-center text-xs mb-2">--- COMANDA COCINA ---</p>
        <div className="space-y-2 text-xs">
          {order.items?.map((item, idx) => (
            <div key={idx} className="leading-snug">
              <p className="font-black text-sm">
                {item.quantity}x {item.product.name.toUpperCase()}
              </p>

              {/* Elección de Papas */}
              {item.selectedPapa && (
                <p className="pl-2 text-[11px] font-semibold">
                  └ Papas: {item.selectedPapa}
                </p>
              )}

              {/* Adicionales / Extras */}
              {item.selectedExtras && item.selectedExtras.length > 0 && (
                <p className="pl-2 text-[11px]">
                  └ Extras: {item.selectedExtras.map((e) => e.name).join(', ')}
                </p>
              )}

              {/* Ingredientes Quitados */}
              {item.removedIngredients && item.removedIngredients.length > 0 && (
                <p className="pl-2 text-[11px] font-bold">
                  └ SIN: {item.removedIngredients.join(', ').toUpperCase()}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Total Cobrado */}
      <div className="text-right font-black text-sm pt-1">
        <p>TOTAL: ${order.total.toLocaleString('es-AR')}</p>
      </div>
    </div>
  )
}