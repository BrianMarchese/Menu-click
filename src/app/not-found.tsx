import Link from "next/link"
import { FiArrowLeft, FiCompass, FiHome, FiShoppingBag } from "react-icons/fi"



export default function NotFound(){
    return (
<div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 text-center text-slate-100">
      
      {/* Luces de ambiente en segundo plano (ultra livianas) */}
      <div className="absolute top-1/3 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-lg space-y-8">
        
        {/* Número 404 Gigante en Gradiente */}
        <div className="relative inline-block select-none">
          <h1 className="text-8xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text from-indigo-200 via-indigo-500 to-slate-950">
            404
          </h1>
          <div className="absolute -bottom-2 left-1/2 h-1 w-2/3 -translate-x-1/2 rounded-full from-transparent via-indigo-400 to-transparent opacity-50" />
        </div>

        {/* Mensaje principal */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3.5 py-1 text-[11px] font-black uppercase tracking-widest text-indigo-400">
            <span>Página no encontrada - 404</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-slate-100">
            UPSS!
          </h2>

          <p className="mx-auto max-w-md text-xs sm:text-sm text-slate-400 leading-relaxed">
            Parece que la pagina a la que intentás ingresar no existe o cambió de lugar. No te preocupes, el menú sigue intacto.
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-indigo-400 px-6 py-3.5 text-xs font-black uppercase text-slate-950 transition-all hover:bg-indigo-300 hover:shadow-lg hover:shadow-indigo-400/25 active:scale-95"
          >
            <FiHome className="h-4 w-4" />
            <span>Ir al Menú Principal</span>
          </Link>

        </div>

      </div>

      {/* Marca discreta al pie */}
      <span className="absolute bottom-6 text-[10px] font-extrabold uppercase tracking-widest text-slate-600">
        Club del Bajón VGG
      </span>

    </div>
  )
}