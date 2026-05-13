'use client'

import { useActionState } from 'react'
import { updatePassword } from '@/app/actions'

export default function ResetPasswordPage() {
  const [state, action, pending] = useActionState(updatePassword, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-sm bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h1 className="text-2xl font-black text-slate-100 uppercase tracking-tight text-center mb-2">
          MM-Veikkaus 2026
        </h1>
        <p className="text-sm text-slate-500 text-center mb-6">Aseta uusi salasana</p>
        <form action={action} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Uusi salasana</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full bg-slate-700 border border-slate-600 text-slate-100 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-600 mt-1">Vähintään 6 merkkiä</p>
          </div>
          {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-500 disabled:opacity-50"
          >
            {pending ? 'Odota...' : 'Tallenna salasana'}
          </button>
        </form>
      </div>
    </div>
  )
}
