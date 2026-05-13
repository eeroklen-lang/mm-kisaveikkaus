'use client'

import { useActionState } from 'react'
import { joinGroup } from '@/app/actions'
import Link from 'next/link'

export default function LiityPage() {
  const [state, action, pending] = useActionState(joinGroup, null)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-bold text-lg">Liity porukkaan</h1>
          <Link href="/" className="hidden md:block text-sm text-blue-600 hover:underline">Takaisin</Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <div className="bg-white rounded-xl border p-6">
          {state?.success ? (
            <div className="text-center space-y-3">
              <p className="text-green-600 font-medium">Liityit porukkaan koodilla <span className="font-mono font-bold">{state.code}</span>!</p>
              <Link href="/tulokset" className="inline-block text-sm text-blue-600 hover:underline">
                Katso tulostaulu
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4">Syötä saamasi kutsukoodi liittyäksesi porukkaan.</p>
              <form action={action} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kutsukoodi</label>
                  <input
                    name="invite_code"
                    type="text"
                    required
                    placeholder="esim. MM2026"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase tracking-widest"
                  />
                </div>
                {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
                <button
                  type="submit"
                  disabled={pending}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50"
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
