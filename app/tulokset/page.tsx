import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'

type Row = {
  display_name: string
  total: number
  correct: number
}

export default async function Tulokset({
  searchParams,
}: {
  searchParams: Promise<{ porukka?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { porukka } = await searchParams

  const { data: memberships } = await supabase
    .from('group_memberships')
    .select('invite_code')
    .eq('user_id', user!.id)

  const groups = (memberships ?? []).map((m) => m.invite_code)
  const activeGroup = porukka && groups.includes(porukka) ? porukka : groups[0] ?? null

  let rows: Row[] = []

  if (activeGroup) {
    const { data: members } = await supabase
      .from('group_memberships')
      .select('user_id')
      .eq('invite_code', activeGroup)

    const memberIds = (members ?? []).map((m) => m.user_id)

    const [{ data: profiles }, { data: predictions }] = await Promise.all([
      supabase.from('profiles').select('id, display_name').in('id', memberIds),
      supabase.from('predictions').select('user_id, points').in('user_id', memberIds).not('points', 'is', null),
    ])

    const nameMap = new Map(
      (profiles ?? []).map((p) => [p.id, p.display_name])
    )

    const totals = new Map<string, Row>()
    for (const p of predictions ?? []) {
      const name = nameMap.get(p.user_id) ?? 'Tuntematon'
      const prev = totals.get(p.user_id) ?? { display_name: name, total: 0, correct: 0 }
      totals.set(p.user_id, {
        display_name: name,
        total: prev.total + (p.points ?? 0),
        correct: prev.correct + (p.points != null && p.points > 0 ? 1 : 0),
      })
    }

    for (const id of memberIds) {
      if (!totals.has(id)) {
        totals.set(id, { display_name: nameMap.get(id) ?? 'Tuntematon', total: 0, correct: 0 })
      }
    }

    rows = [...totals.values()].sort((a, b) => b.total - a.total)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-bold text-lg">Tulostaulu</h1>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/liity" className="text-sm text-blue-600 hover:underline">Liity porukkaan</Link>
            <Link href="/" className="text-sm text-blue-600 hover:underline">Veikkaukset</Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6 space-y-4">
        {groups.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center">
            <p className="text-gray-500 mb-3">Et ole vielä missään porukassa.</p>
            <Link href="/liity" className="text-blue-600 text-sm hover:underline">Liity porukkaan kutsukoodilla</Link>
          </div>
        ) : (
          <>
            {groups.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {groups.map((code) => (
                  <Link
                    key={code}
                    href={`/tulokset?porukka=${code}`}
                    className={`px-3 py-2 rounded-full text-sm font-medium border ${
                      code === activeGroup
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {code}
                  </Link>
                ))}
              </div>
            )}

            {activeGroup && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Porukka</p>
                <h2 className="text-xl font-bold tracking-wide">{activeGroup}</h2>
              </div>
            )}

            <div className="bg-white rounded-xl border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-2 text-left text-gray-500 font-medium w-8">#</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Pelaaja</th>
                    <th className="px-4 py-2 text-right text-gray-500 font-medium">Oikeat</th>
                    <th className="px-4 py-2 text-right text-gray-500 font-medium">Pisteet</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={row.display_name} className="border-b last:border-0">
                      <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3 font-medium">{row.display_name}</td>
                      <td className="px-4 py-3 text-right text-gray-500">{row.correct}</td>
                      <td className="px-4 py-3 text-right font-bold">{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 text-center">Oikea tulos = 3p · Oikea voittaja = 1p</p>
          </>
        )}
      </main>
    </div>
  )
}
