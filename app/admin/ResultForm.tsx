'use client'

import { useActionState } from 'react'
import { updateMatchResult } from '@/app/actions'

type Match = {
  id: number
  home_team: string
  away_team: string
  match_date: string
  status: string
}

export default function ResultForm({ matches }: { matches: Match[] }) {
  const [state, action, pending] = useActionState(updateMatchResult, null)

  if (matches.length === 0) {
    return <p className="text-sm text-gray-400 italic">Ei avoimia pelejä.</p>
  }

  return (
    <form action={action} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Peli</label>
        <select name="match_id" required
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          {matches.map((m) => (
            <option key={m.id} value={m.id}>
              {new Date(m.match_date).toLocaleDateString('fi-FI', { day: 'numeric', month: 'numeric', timeZone: 'Europe/Helsinki' })}
              {' '}{m.home_team} vs {m.away_team}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Kotijoukkue</label>
          <input name="home_score" type="number" min="0" max="20" required
            className="w-full border rounded-lg px-3 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <span className="text-gray-400 mt-5">–</span>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Vierasjoukkue</label>
          <input name="away_score" type="number" min="0" max="20" required
            className="w-full border rounded-lg px-3 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
      {state?.success && <p className="text-green-600 text-sm">Tulos tallennettu ja pisteet laskettu!</p>}
      <button type="submit" disabled={pending}
        className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50">
        {pending ? 'Tallennetaan...' : 'Tallenna tulos ja laske pisteet'}
      </button>
    </form>
  )
}
