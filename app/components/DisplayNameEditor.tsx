'use client'

import { useActionState } from 'react'
import { updateDisplayName } from '@/app/actions'

export default function DisplayNameEditor({ name }: { name: string }) {
  const [state, action, pending] = useActionState(updateDisplayName, null)

  return (
    <form action={action} className="flex items-center gap-1">
      <input
        name="display_name"
        defaultValue={name}
        required
        className="text-sm border-b border-slate-700 bg-transparent w-28 focus:outline-none focus:border-blue-500 text-slate-300"
      />
      <button
        type="submit"
        disabled={pending}
        className="text-xs text-slate-600 hover:text-blue-400 disabled:opacity-50 px-1"
      >
        {pending ? '...' : state?.success ? '✓' : 'Tallenna'}
      </button>
    </form>
  )
}
