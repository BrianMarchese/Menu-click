'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { FiLock, FiMail, FiAlertCircle, FiRefreshCw } from 'react-icons/fi'

export default function AdminLoginPage() {
  const [errorMsg, setErrorMsg] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleLogin = (formData: FormData) => {
    setErrorMsg('')

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      setErrorMsg('Por favor completá todos los campos.')
      return
    }

    startTransition(async () => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        if (data.session) {
          router.replace('/admin/pedidos')
        }
      } catch (err: any) {
        console.error('Error de autenticación:', err)
        setErrorMsg('Email o contraseña incorrectos.')
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-indigo-800/30 px-4 py-12 text-slate-100">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-blue-800/80 bg-indigo-800/30 from-indigo-950/60 to-slate-900/90 p-8 shadow-2xl backdrop-blur-md">
        
        <div className="text-center">
          <span className="inline-block rounded-xl bg-indigo-600/30 px-3 py-1 text-xs font-black uppercase text-indigo-600 border border-indigo-400/30 mb-2">
            Acceso Restringido
          </span>
          <h1 className="text-2xl font-black uppercase tracking-wider text-slate-700/60">
            Panel Admin
          </h1>
          <p className="text-ms text-slate-700 mt-1">
            Ingresá tus credenciales de administrador
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-700/30 p-3 text-ms text-red-300">
            <FiAlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form action={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-200" />
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-xl border border-blue-800 bg-indigo-800/30 py-3 pl-9 pr-3 text-sm text-slate-100 placeholder-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-200" />
              <input
                type="password"
                name="password"
                required
                className="w-full rounded-xl border border-blue-800 bg-indigo-800/30 py-3 pl-9 pr-3 text-sm text-slate-100 placeholder-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-400 py-3.5 text-sm font-black uppercase text-slate-900 transition hover:bg-indigo-300 active:scale-[0.98] disabled:opacity-50 mt-2 shadow-lg shadow-indigo-400/20"
          >
            {isPending ? (
              <>
                <FiRefreshCw className="animate-spin h-4 w-4" />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              'Ingresar al Panel'
            )}
          </button>
        </form>

      </div>
    </div>
  )
}