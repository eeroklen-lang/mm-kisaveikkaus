import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { createInviteCode, toggleInviteCode } from '@/app/actions'
import SyncButton from './SyncButton'
import ResultForm from './ResultForm'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const admins = (process.env.ADMIN_EMAIL ?? '').split(',').map(e => e.trim())
  if (!admins.includes(user?.email ?? '')) redirect('/')

  const [{ data: codes }, { data: openMatches }] = await Promise.all([
    supabase.from('invite_codes').select('*').order('created_at', { ascending: false }),
    supabase.from('matches').select('id, home_team, away_team, match_date, status')
      .neq('status', 'FINISHED').order('match_date'),
  ])

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-black text-lg text-slate-100 uppercase tracking-tight">Admin</h1>
          <Link href="/" className="text-sm text-blue-400 hover:underline">Takaisin</Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-32 md:pb-6 space-y-6">
        <SyncButton />

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <h2 className="font-semibold text-slate-100 mb-1">Syötä tulos manuaalisesti</h2>
          <p className="text-xs text-slate-500 mb-3">Käytä jos API ei päivity automaattisesti</p>
          <ResultForm matches={openMatches ?? []} />
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <h2 className="font-semibold text-slate-100 mb-3">Luo kutsukoodi</h2>
          <form action={createInviteCode} className="flex gap-2">
            <input
              name="custom_code"
              placeholder="Oma koodi (valinnainen)"
              className="flex-1 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase placeholder:text-slate-600"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-500"
            >
              Luo
            </button>
          </form>
          <p className="text-xs text-slate-600 mt-2">Jätä tyhjäksi satunnaisen koodin luomiseksi</p>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-700/50">
                <th className="px-4 py-2 text-left text-slate-500 font-medium">Koodi</th>
                <th className="px-4 py-2 text-left text-slate-500 font-medium">Luotu</th>
                <th className="px-4 py-2 text-right text-slate-500 font-medium">Tila</th>
              </tr>
            </thead>
            <tbody>
              {(codes ?? []).length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-slate-500">Ei koodeja</td>
                </tr>
              )}
              {(codes ?? []).map((c) => (
                <tr key={c.code} className="border-b border-slate-700 last:border-0">
                  <td className="px-4 py-3 font-mono font-bold tracking-widest text-slate-100">{c.code}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(c.created_at).toLocaleDateString('fi-FI')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={toggleInviteCode.bind(null, c.code, !c.is_active)}>
                      <button
                        type="submit"
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          c.is_active
                            ? 'bg-green-950 text-green-400 hover:bg-green-900'
                            : 'bg-slate-700 text-slate-500 hover:bg-slate-600'
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
