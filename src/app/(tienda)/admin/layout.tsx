'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { FiShoppingBag, FiBox, FiLogOut, FiRefreshCw } from 'react-icons/fi'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session && !isLoginPage) {
        router.replace('/admin/login')
      } else {
        setAuthenticated(!!session)
      }
      setLoading(false)
    }

    checkAuth()

    // Escuchar cambios de sesión (login o logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' && !isLoginPage) {
        setAuthenticated(false)
        router.replace('/admin/login')
      } else if (session) {
        setAuthenticated(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [pathname, isLoginPage, router])

  // Si es la página de login, simplemente la renderizo
  if (isLoginPage) {
    return <>{children}</>
  }

  // Mientras verifica la sesión, muestro pantalla de carga
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex items-center gap-3">
          <FiRefreshCw className="h-6 w-6 animate-spin text-indigo-400" />
          <span className="text-sm font-semibold">Verificando sesión...</span>
        </div>
      </div>
    )
  }

  // Si no está autenticado, no renderizo el contenido
  if (!authenticated) {
    return null
  }

  // cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  return (
    <div className="min-h-screen">
      {/* NAVBAR SUPERIOR EXCLUSIVA DE ADMIN */}
      <header className="sticky top-0 z-40 border-b bg-indigo-300  border-blue-800/60 px-4 sm:px-8 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-center">
          

          {/* Menú de Navegación + Salir */}
          <nav className="flex items-center gap-2">
            <Link
              href="/admin/pedidos"
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                pathname === '/admin/pedidos'
                  ? 'bg-indigo-400 text-slate-950 shadow-md shadow-indigo-400/20'
                  : 'text-slate-600 hover:bg-indigo-500/40'
              }`}
            >
              <FiShoppingBag className="h-4 w-4" />
              <span>Pedidos</span>
            </Link>

            <Link
              href="/admin/productos"
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                pathname === '/admin/productos'
                  ? 'bg-indigo-400 text-slate-950 shadow-md shadow-indigo-400/20'
                  : 'text-slate-600 hover:bg-indigo-500/40'
              }`}
            >
              <FiBox className="h-4 w-4" />
              <span>Productos</span>
            </Link>

            {/* Botón Cerrar Sesión */}
            <button
              onClick={handleLogout}
              className="ml-2 flex items-center gap-1.5 rounded-xl border  px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-800/50 transition active:scale-95 cursor-pointer"
              title="Cerrar sesión"
            >
              <FiLogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </nav>

        </div>
      </header>

      <main>{children}</main>
    </div>
  )
}