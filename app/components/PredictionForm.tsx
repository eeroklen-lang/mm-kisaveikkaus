'use client'

import { useActionState } from 'react'
import { savePrediction } from '@/app/actions'

type Props = {
  matchId: number
  prediction: { home_score: number; away_score: number } | null
}

export default function PredictionForm({ matchId, prediction }: Props) {
  const [state, action, pending] = useActionState(savePrediction, null)

  return (
    <form action={action} className="mt-2 space-y-1.5">
      <p className="text-xs text-slate-600">Veikkaa 90 min tulos (jatkoaika ei huomioida)</p>
      <div className="flex items-center gap-2">
      <input type="hidden" name="match_id" value={matchId} />
      <input
        name="home_score"
        type="number"
        min="0"
        max="20"
        defaultValue={prediction?.home_score ?? ''}
        required
        className="w-12 bg-slate-700 border border-slate-600 text-slate-100 rounded px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <span className="text-slate-600 text-sm">–</span>
      <input
        name="away_score"
        type="number"
        min="0"
        max="20"
        defaultValue={prediction?.away_score ?? ''}
        required
        className="w-12 bg-slate-700 border border-slate-600 text-slate-100 rounded px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={pending}
        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-500 disabled:opacity-50 font-medium"
      >
        {pending ? '...' : state?.success ? 'Tallennettu!' : prediction ? 'Päivitä' : 'Tallenna'}
      </button>
      </div>
    </form>
  )
}
