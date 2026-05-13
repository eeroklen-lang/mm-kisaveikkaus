import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { createInviteCode, toggleInviteCode } from '@/app/actions'
import SyncButton from './SyncButton'
import ResultForm from './ResultForm'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user?.email !== process.env.ADMIN_EMAIL) redirect('/')

  const [{ data: codes }, { data: openMatches }] = await Promise.all([
    supabase.from('invite_codes').select('*').order('created_at', { ascending: false }),
    supabase.from('matches').select('id, home_team, away_team, match_date, status')
      .neq('status', 'FINISHED').order('match_date'),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-bold text-lg">Admin</h1>
          <Link href="/" className="text-sm text-blue-600 hover:underline">Takaisin</Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <SyncButton />

        <div className="bg-white rounded-xl border p-4">
          <h2 className="font-semibold mb-1">Syötä tulos manuaalisesti</h2>
          <p className="text-xs text-gray-400 mb-3">Käytä jos API ei päivity automaattisesti</p>
          <ResultForm matches={openMatches ?? []} />
        </div>

        <div className="bg-white rounded-xl border p-4">
          <h2 className="font-semibold mb-3">Luo kutsukoodi</h2>
          <form action={createInviteCode} className="flex gap-2">
            <input
              name="custom_code"
              placeholder="Oma koodi (valinnainen)"
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Luo
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-2">Jätä tyhjäksi satunnaisen koodin luomiseksi</p>
        </div>

        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-2 text-left text-gray-500 font-medium">Koodi</th>
                <th className="px-4 py-2 text-left text-gray-500 font-medium">Luotu</th>
                <th className="px-4 py-2 text-right text-gray-500 font-medium">Tila</th>
              </tr>
            </thead>
            <tbody>
              {(codes ?? []).length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-400">Ei koodeja</td>
                </tr>
              )}
              {(codes ?? []).map((c) => (
                <tr key={c.code} className="border-b last:border-0">
                  <td className="px-4 py-3 font-mono font-bold tracking-widest">{c.code}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(c.created_at).toLocaleDateString('fi-FI')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={toggleInviteCode.bind(null, c.code, !c.is_active)}>
                      <button
                        type="submit"
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          c.is_active
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {c.is_active ? 'Aktiivinen' : 'Poistettu käytöstä'}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
