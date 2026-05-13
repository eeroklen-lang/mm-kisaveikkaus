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
        className="text-sm border-b border-gray-300 bg-transparent w-28 focus:outline-none focus:border-blue-500 text-gray-700"
      />
      <button
        type="submit"
        disabled={pending}
        className="text-xs text-gray-400 hover:text-blue-600 disabled:opacity-50 px-1"
      >
        {pending ? '...' : state?.success ? '✓' : 'Tallenna'}
      </button>
    </form>
  )
}
