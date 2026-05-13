'use client'

import { useActionState } from 'react'
import { syncMatches } from '@/app/actions'

export default function SyncButton() {
  const [state, action, pending] = useActionState(syncMatches, null)

  return (
    <div className="bg-white rounded-xl border p-4">
      <h2 className="font-semibold mb-1">Synkronoi pelit API:sta</h2>
      <p className="text-xs text-gray-400 mb-3">Hakee MM 2026 -pelit ja päivittää tulokset football-data.orgista</p>
      <form action={action} className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {pending ? 'Synkronoidaan...' : 'Synkronoi nyt'}
        </button>
        {state?.success && (
          <span className="text-green-600 text-sm">Valmis — {state.count} peliä haettu</span>
        )}
        {state?.error && (
          <span className="text-red-600 text-sm">{state.error}</span>
        )}
      </form>
    </div>
  )
}
