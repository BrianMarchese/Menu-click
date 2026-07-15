'use client'

import { useState } from "react"
import { FaWhatsapp } from "react-icons/fa"
import { FiHome, FiInfo, FiMapPin, FiMenu, FiX } from "react-icons/fi"

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)

  const WHATSAPP_NUMBER = '543412445428'

  return (
    <nav>
      <div className="sticky top-0 z-30 grid h-16 grid-cols-3 items-center bg-blue-800 px-6">
        
        {/* Columna Izquierda: Botón Hamburguesa */}
        <div className="flex justify-start">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="rounded-lg p-2 text-slate-300 hover:bg-blue-900 focus:outline-none transition"
            aria-label="Abrir menú"
          >
            <FiMenu className="h-6 w-6" />
          </button>
        </div>

        {/* Columna Central: Nombre del Local (Centrado perfecto) */}
        <div className="flex justify-center text-center">
          <span className="text-base sm:text-lg font-bold tracking-wider text-indigo-200 whitespace-nowrap">
            El Club del Bajón VGG
          </span>
        </div>

        {/* Columna Derecha: Espacio reservado para el Carrito */}
        <div className="flex justify-end">
          {/* Acá irá el carrito flotante más adelante */}
        </div>
      </div>

      {/* 2. SIDEBAR DESPLEGABLE */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-blue-800 py-6 px-4 transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <span className="text-lg font-bold tracking-wider text-indigo-200">
            El Club del Bajón VGG
          </span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-800 hover:text-white transition"
            aria-label="Cerrar menú"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-4 rounded-xl px-4 py-3 text-left font-medium text-slate-300 hover:bg-white/10 hover:text-white transition"
          >
            <FiHome className="h-5 w-5 text-indigo-400" />
            Inicio
          </button>

          <button
            onClick={() => {
              setIsInfoModalOpen(true)
              setIsMenuOpen(false)
            }}
            className="flex items-center gap-4 rounded-xl px-4 py-3 text-left font-medium text-slate-300 hover:bg-white/10 hover:text-white transition"
          >
            <FiInfo className="h-5 w-5 text-indigo-400" />
            Información
          </button>

          <button
            onClick={() => {
              setIsMapModalOpen(true)
              setIsMenuOpen(false)
            }}
            className="flex items-center gap-4 rounded-xl px-4 py-3 text-left font-medium text-slate-300 hover:bg-white/10 hover:text-white transition"
          >
            <FiMapPin className="h-5 w-5 text-indigo-400" />
            Ubicación
          </button>
        </nav>
      </aside>

      {/* Backdrop */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
        />
      )}

      
      {/* MODAL: Información */}
      {isInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-blue-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-indigo-300">Información del Local</h3>
              <button
                onClick={() => setIsInfoModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-800 hover:text-white transition"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            
            <div className="my-6 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-400">🕒 Horarios de Atención</h4>
                <p className="mt-1 text-base text-slate-200">Martes a Domingos: 19:00 a 00:00 hs</p>
                <p className="text-xs text-red-400 font-medium">Lunes: Cerrado</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-400">💬 Contacto</h4>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-950/20"
                >
                  <FaWhatsapp className="h-5 w-5" />
                  Escribinos por WhatsApp
                </a>
              </div>
            </div>

            <button
              onClick={() => setIsInfoModalOpen(false)}
              className="w-full rounded-xl bg-blue-800 py-3 font-semibold text-slate-300 hover:bg-blue-700 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Ubicación */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-blue-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-indigo-300">Nuestra Ubicación</h3>
              <button
                onClick={() => setIsMapModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-800 hover:text-white transition"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            
            <div className="my-6">
              <div className="overflow-hidden rounded-xl border border-slate-800">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d107134.61944773824!2d-60.766679589330925!3d-32.95217997577579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b7ab1b9e4a3625%3A0x280e5518b0f83692!2sRosario%2C%20Santa%20Fe!5e0!3m2!1ses-419!2sar!4v1700000000000!5m2!1ses-419!2sar"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="opacity-90 contrast-125"
                ></iframe>
              </div>
              <p className="mt-4 text-sm text-slate-400 text-center">
                Hacemos envíos en Rosario, Villa Gobernador Gálvez y alrededores.
              </p>
            </div>

            <button
              onClick={() => setIsMapModalOpen(false)}
              className="w-full rounded-xl bg-blue-800 py-3 font-semibold text-slate-300 hover:bg-blue-700 transition"
            >
              Cerrar Mapa
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
