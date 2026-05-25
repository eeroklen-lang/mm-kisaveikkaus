'use client'

import { useActionState } from 'react'
import { joinGroup } from '@/app/actions'
import Link from 'next/link'

export default function LiityPage() {
  const [state, action, pending] = useActionState(joinGroup, null)

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-black text-lg text-slate-100 uppercase tracking-tight">Liity porukkaan</h1>
          <Link href="/" className="hidden md:block text-sm text-blue-400 hover:underline">Takaisin</Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-32 md:pb-6">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          {state?.success ? (
            <div className="text-center space-y-3">
              <p className="text-green-400 font-medium">Liityit porukkaan koodilla <span className="font-mono font-bold">{state.code}</span>!</p>
              <Link href="/tulokset" className="inline-block text-sm text-blue-400 hover:underline">
                Katso tulostaulu
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-400 mb-4">Syötä saamasi kutsukoodi liittyäksesi porukkaan.</p>
              <form action={action} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Kutsukoodi</label>
                  <input
                    name="invite_code"
                    type="text"
                    required
                    placeholder="esim. MM2026"
                    className="w-full bg-slate-700 border border-slate-600 text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase tracking-widest placeholder:text-slate-600"
                  />
                </div>
                <div className="border border-slate-700 rounded-lg p-4 space-y-1">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      name="has_stake"
                      type="checkbox"
                      className="mt-0.5 w-4 h-4 accent-violet-500 shrink-0"
                    />
                    <span className="text-sm text-slate-300">Osallistun porukan rahalliseen panokseen</span>
                  </label>
                  <p className="text-xs text-slate-600 pl-7">Tieto tallennetaan vain tilastointia varten, eikä sitä jaeta muille.</p>
                </div>
                {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}
                <button
                  type="submit"
                  disabled={pending}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-blue-500 disabled:opacity-50"
                >
                  {pending ? 'Odota...' : 'Liity'}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
