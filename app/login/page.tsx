'use client'

import { useActionState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { login, register, requestPasswordReset } from '@/app/actions'
import Link from 'next/link'

function LoginForm() {
  const [state, action, pending] = useActionState(login, null)
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Sähköposti</label>
        <input name="email" type="email" required autoComplete="email"
          className="w-full bg-slate-700 border border-slate-600 text-slate-100 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-600" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Salasana</label>
        <input name="password" type="password" required minLength={6} autoComplete="current-password"
          className="w-full bg-slate-700 border border-slate-600 text-slate-100 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}
      <button type="submit" disabled={pending}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-500 disabled:opacity-50">
        {pending ? 'Odota...' : 'Kirjaudu sisään'}
      </button>
      <p className="text-center">
        <Link href="/login?tab=reset" className="text-sm text-slate-500 hover:text-slate-300">
          Unohditko salasanan?
        </Link>
      </p>
    </form>
  )
}

function ResetRequestForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, null)
  if (state?.success) {
    return (
      <div className="text-center space-y-3">
        <p className="text-green-400 text-sm font-medium">Linkki lähetetty!</p>
        <p className="text-slate-500 text-sm">Tarkista sähköpostisi ja klikkaa linkkiä asettaaksesi uuden salasanan.</p>
        <Link href="/login" className="block text-sm text-blue-400 hover:underline mt-4">Takaisin kirjautumiseen</Link>
      </div>
    )
  }
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Sähköposti</label>
        <input name="email" type="email" required autoComplete="email"
          className="w-full bg-slate-700 border border-slate-600 text-slate-100 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-600" />
      </div>
      {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}
      <button type="submit" disabled={pending}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-500 disabled:opacity-50">
        {pending ? 'Odota...' : 'Lähetä palautuslinkki'}
      </button>
      <p className="text-center">
        <Link href="/login" className="text-sm text-slate-500 hover:text-slate-300">
          Takaisin kirjautumiseen
        </Link>
      </p>
    </form>
  )
}

function RegisterForm() {
  const [state, action, pending] = useActionState(register, null)
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Sähköposti</label>
        <input name="email" type="email" required autoComplete="email"
          className="w-full bg-slate-700 border border-slate-600 text-slate-100 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-600" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Salasana</label>
        <input name="password" type="password" required minLength={6} autoComplete="new-password"
          className="w-full bg-slate-700 border border-slate-600 text-slate-100 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <p className="text-xs text-slate-600 mt-1">Vähintään 6 merkkiä</p>
      </div>
      {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}
      <button type="submit" disabled={pending}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-500 disabled:opacity-50">
        {pending ? 'Odota...' : 'Luo tili'}
      </button>
    </form>
  )
}

function LoginPageContent() {
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab')
  const mode = tab === 'register' ? 'register' : tab === 'reset' ? 'reset' : 'login'

  return (
    <div className="w-full max-w-sm bg-slate-800 rounded-xl border border-slate-700 p-6">
      <h1 className="text-2xl font-black text-slate-100 uppercase tracking-tight text-center mb-6">MM-Veikkaus 2026</h1>

      {mode !== 'reset' && (
        <div className="flex rounded-lg border border-slate-600 overflow-hidden mb-6">
          <Link href="/login" replace
            className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
              mode === 'login' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
            }`}>
            Kirjaudu
          </Link>
          <Link href="/login?tab=register" replace
            className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
              mode === 'register' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
            }`}>
            Rekisteröidy
          </Link>
        </div>
      )}

      {mode === 'reset' && (
        <p className="text-sm text-slate-500 text-center mb-6">Syötä sähköpostiosoitteesi niin lähetämme palautuslinkin.</p>
      )}

      {mode === 'login' && <LoginForm />}
      {mode === 'register' && <RegisterForm />}
      {mode === 'reset' && <ResetRequestForm />}
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <Suspense fallback={<div className="w-full max-w-sm bg-slate-800 rounded-xl border border-slate-700 p-6 h-64" />}>
        <LoginPageContent />
      </Suspense>
    </div>
  )
}
