'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { login, register } from '@/app/actions'
import Link from 'next/link'

function LoginForm() {
  const [state, action, pending] = useActionState(login, null)
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sähköposti</label>
        <input name="email" type="email" required autoComplete="email"
          className="w-full border rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Salasana</label>
        <input name="password" type="password" required minLength={6} autoComplete="current-password"
          className="w-full border rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
      <button type="submit" disabled={pending}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
        {pending ? 'Odota...' : 'Kirjaudu sisään'}
      </button>
    </form>
  )
}

function RegisterForm() {
  const [state, action, pending] = useActionState(register, null)
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sähköposti</label>
        <input name="email" type="email" required autoComplete="email"
          className="w-full border rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Salasana</label>
        <input name="password" type="password" required minLength={6} autoComplete="new-password"
          className="w-full border rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <p className="text-xs text-gray-400 mt-1">Vähintään 6 merkkiä</p>
      </div>
      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
      <button type="submit" disabled={pending}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
        {pending ? 'Odota...' : 'Luo tili'}
      </button>
    </form>
  )
}

export default function LoginPage() {
  const searchParams = useSearchParams()
  const mode = searchParams.get('tab') === 'register' ? 'register' : 'login'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-center mb-6">MM-Veikkaus 2026</h1>

        <div className="flex rounded-lg border overflow-hidden mb-6">
          <Link href="/login" replace
            className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
              mode === 'login' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
            }`}>
            Kirjaudu
          </Link>
          <Link href="/login?tab=register" replace
            className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
              mode === 'register' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
            }`}>
            Rekisteröidy
          </Link>
        </div>

        <p className="text-sm text-gray-500 text-center mb-4">
          {mode === 'login' ? 'Kirjaudu olemassa olevalla tilillä' : 'Luo uusi käyttäjätili'}
        </p>

        {mode === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  )
}
