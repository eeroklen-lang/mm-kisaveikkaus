import { createClient } from '@/lib/supabase-server'
import { logout } from '@/app/actions'
import PredictionForm from '@/app/components/PredictionForm'
import DisplayNameEditor from '@/app/components/DisplayNameEditor'
import { getFlag, getTeamName } from '@/lib/team-flags'
import Link from 'next/link'

type Match = {
  id: number
  home_team: string
  away_team: string
  match_date: string
  home_score: number | null
  away_score: number | null
  status: string
  stage: string
}

type Prediction = {
  match_id: number
  home_score: number
  away_score: number
  points: number | null
}

type RevealedPrediction = {
  display_name: string
  home_score: number
  away_score: number
  points: number | null
}

type MatchStats = {
  total: number
  homeWins: number
  draws: number
  awayWins: number
  exactCorrect: number
  outcomeCorrect: number
}

function computeStats(preds: Prediction[], match: Match): MatchStats {
  const stats: MatchStats = { total: 0, homeWins: 0, draws: 0, awayWins: 0, exactCorrect: 0, outcomeCorrect: 0 }
  for (const p of preds) {
    stats.total++
    const outcome = Math.sign(p.home_score - p.away_score)
    if (outcome > 0) stats.homeWins++
    else if (outcome === 0) stats.draws++
    else stats.awayWins++

    if (match.status === 'FINISHED' && match.home_score !== null && match.away_score !== null) {
      const actualOutcome = Math.sign(match.home_score - match.away_score)
      if (p.home_score === match.home_score && p.away_score === match.away_score) stats.exactCorrect++
      else if (outcome === actualOutcome) stats.outcomeCorrect++
    }
  }
  return stats
}

function OutcomeBar({ stats, homeTeam, awayTeam }: { stats: MatchStats; homeTeam: string; awayTeam: string }) {
  if (stats.total === 0) return null
  const hw = Math.round((stats.homeWins / stats.total) * 100)
  const dr = Math.round((stats.draws / stats.total) * 100)
  const aw = 100 - hw - dr
  return (
    <div className="mt-2 space-y-1">
      <div className="flex rounded-full overflow-hidden h-2 gap-px">
        {hw > 0 && <div className="bg-blue-500" style={{ width: `${hw}%` }} />}
        {dr > 0 && <div className="bg-slate-600" style={{ width: `${dr}%` }} />}
        {aw > 0 && <div className="bg-red-500" style={{ width: `${aw}%` }} />}
      </div>
      <div className="flex justify-between text-xs text-slate-500">
        <span>{getTeamName(homeTeam).split(' ')[0]} {hw}%</span>
        <span>Tasapeli {dr}%</span>
        <span>{aw}% {getTeamName(awayTeam).split(' ')[0]}</span>
      </div>
      <p className="text-xs text-slate-600 text-center">{stats.total} veikkausta</p>
    </div>
  )
}

function FinishedStats({ stats }: { stats: MatchStats }) {
  if (stats.total === 0) return null
  const exactPct = Math.round((stats.exactCorrect / stats.total) * 100)
  const outcomePct = Math.round(((stats.exactCorrect + stats.outcomeCorrect) / stats.total) * 100)
  return (
    <div className="mt-2 flex gap-3 text-xs text-slate-500">
      <span>Oikea tulos: <span className="font-medium text-slate-300">{stats.exactCorrect}/{stats.total} ({exactPct}%)</span></span>
      <span>·</span>
      <span>Oikea lopputulos: <span className="font-medium text-slate-300">{stats.exactCorrect + stats.outcomeCorrect}/{stats.total} ({outcomePct}%)</span></span>
    </div>
  )
}

function PointsBadge({ points }: { points: number | null }) {
  if (points === null) return null
  const styles =
    points === 3 ? 'bg-green-950 text-green-400' :
    points === 1 ? 'bg-yellow-950 text-yellow-400' :
    'bg-slate-700 text-slate-500'
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${styles}`}>
      {points}p
    </span>
  )
}

function RevealedPredictions({ preds, match }: { preds: RevealedPrediction[]; match: Match }) {
  const isFinished = match.status === 'FINISHED'
  const sorted = [...preds].sort((a, b) => (b.points ?? -1) - (a.points ?? -1))
  return (
    <div className="mt-3 space-y-1 border-t border-slate-700 pt-2">
      {sorted.map((p, i) => {
        const pts = p.points
        const color = pts === 3 ? 'text-green-400' : pts === 1 ? 'text-yellow-400' : isFinished ? 'text-slate-600' : 'text-slate-400'
        return (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="text-slate-400 truncate max-w-[60%]">{p.display_name}</span>
            <span className={`font-mono font-medium ${color}`}>
              {p.home_score} – {p.away_score}
              {isFinished && pts !== null && <span className="ml-1 text-slate-600">({pts}p)</span>}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function MatchCard({ match, prediction, stats, revealedPreds }: { match: Match; prediction: Prediction | null; stats: MatchStats; revealedPreds: RevealedPrediction[] }) {
  const time = new Date(match.match_date).toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Helsinki' })
  const isScheduled = match.status === 'SCHEDULED'
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED'
  const isFinished = match.status === 'FINISHED'
  const hasPrediction = prediction !== null

  const borderColor =
    isFinished ? 'border-l-slate-700' :
    isLive ? 'border-l-amber-400' :
    hasPrediction ? 'border-l-green-500' :
    'border-l-orange-500'

  return (
    <div className={`bg-slate-800 rounded-xl border border-slate-700 border-l-4 ${borderColor} px-4 py-3`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{time}</span>
          <span className="text-xs text-slate-700">·</span>
          <span className="text-xs text-slate-500">{match.stage}</span>
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
              Käynnissä
            </span>
          )}
          {isFinished && <PointsBadge points={prediction?.points ?? null} />}
          {isScheduled && !hasPrediction && (
            <span className="text-xs font-medium text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">
              Veikkaamatta
            </span>
          )}
          {isScheduled && hasPrediction && (
            <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
              Veikattu
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-base flex-1 text-slate-100">
          <span className="mr-1">{getFlag(match.home_team)}</span>{getTeamName(match.home_team)}
        </span>
        {isFinished ? (
          <span className="font-bold text-base font-mono bg-slate-700 text-slate-100 rounded px-3 py-0.5 shrink-0">
            {match.home_score} – {match.away_score}
          </span>
        ) : (
          <span className="text-slate-700 text-sm shrink-0">vs</span>
        )}
        <span className="font-semibold text-base flex-1 text-right text-slate-100">
          {getTeamName(match.away_team)}<span className="ml-1">{getFlag(match.away_team)}</span>
        </span>
      </div>

      {isScheduled && (
        <PredictionForm matchId={match.id} prediction={prediction} />
      )}

      {(isLive || isFinished) && (
        <div className="mt-2 text-xs text-slate-500">
          {hasPrediction ? (
            <span>
              Veikkauksesi:{' '}
              <span className="font-mono font-medium text-slate-300">
                {prediction!.home_score} – {prediction!.away_score}
              </span>
            </span>
          ) : (
            <span className="italic text-slate-600">Ei veikkausta</span>
          )}
        </div>
      )}

      {isScheduled && hasPrediction && (
        <OutcomeBar stats={stats} homeTeam={match.home_team} awayTeam={match.away_team} />
      )}

      {isFinished && <FinishedStats stats={stats} />}
      {(isLive || isFinished) && revealedPreds.length > 0 && (
        <RevealedPredictions preds={revealedPreds} match={match} />
      )}
    </div>
  )
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ nayta?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { nayta } = await searchParams
  const filter: 'kaikki' | 'tulevat' | 'menneet' = nayta === 'tulevat' ? 'tulevat' : nayta === 'menneet' ? 'menneet' : 'kaikki'

  const [{ data: matches }, { data: myPredictions }, { data: allPredictions }, { data: profile }, { data: profiles }] = await Promise.all([
    supabase.from('matches').select('*').order('match_date'),
    supabase.from('predictions').select('*').eq('user_id', user!.id),
    supabase.from('predictions').select('match_id, user_id, home_score, away_score, points'),
    supabase.from('profiles').select('display_name').eq('id', user!.id).single(),
    supabase.from('profiles').select('id, display_name'),
  ])

  const profileMap = new Map<string, string>(
    (profiles ?? []).map((p: { id: string; display_name: string }) => [p.id, p.display_name])
  )

  const predictionMap = new Map<number, Prediction>(
    (myPredictions ?? []).map((p: Prediction) => [p.match_id, p])
  )

  const allPredsByMatch = new Map<number, Prediction[]>()
  const revealedPredsByMatch = new Map<number, RevealedPrediction[]>()
  for (const p of allPredictions ?? []) {
    const existing = allPredsByMatch.get(p.match_id) ?? []
    existing.push(p)
    allPredsByMatch.set(p.match_id, existing)

    const revealed = revealedPredsByMatch.get(p.match_id) ?? []
    revealed.push({
      display_name: profileMap.get(p.user_id) ?? p.user_id,
      home_score: p.home_score,
      away_score: p.away_score,
      points: p.points,
    })
    revealedPredsByMatch.set(p.match_id, revealed)
  }

  const allMatches = matches ?? []
  const scheduled = allMatches.filter((m) => m.status === 'SCHEDULED')
  const missing = scheduled.filter((m) => !predictionMap.has(m.id)).length
  const visibleMatches =
    filter === 'tulevat' ? allMatches.filter((m) => m.status === 'SCHEDULED') :
    filter === 'menneet' ? allMatches.filter((m) => m.status !== 'SCHEDULED') :
    allMatches
  const grouped = groupByDate(visibleMatches)

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-black text-lg text-slate-100 uppercase tracking-tight">MM-Veikkaus 2026</h1>
          <div className="flex items-center gap-3">
            <Link href="/tulokset" className="hidden md:block text-sm text-blue-400 hover:underline">Tulostaulu</Link>
            <Link href="/liity" className="hidden md:block text-sm text-blue-400 hover:underline">Liity porukkaan</Link>
            {user!.email === process.env.ADMIN_EMAIL && (
              <Link href="/admin" className="text-sm text-slate-600 hover:underline">Admin</Link>
            )}
            <form action={logout}>
              <button className="text-sm text-slate-500 hover:text-slate-200">Ulos</button>
            </form>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 pb-2 flex items-center justify-between">
          <DisplayNameEditor name={profile?.display_name ?? user!.email!} />
          {missing > 0 && (
            <span className="text-xs font-medium text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">
              {missing} veikkausta tekemättä
            </span>
          )}
          {missing === 0 && scheduled.length > 0 && (
            <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
              Kaikki veikattu
            </span>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-32 md:pb-6 space-y-6">
        <div className="flex gap-2">
          {(['kaikki', 'tulevat', 'menneet'] as const).map((v) => (
            <Link
              key={v}
              href={v === 'kaikki' ? '/' : `/?nayta=${v}`}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                filter === v
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'text-slate-400 border-slate-700 hover:border-slate-500'
              }`}
            >
              {v === 'kaikki' ? 'Kaikki' : v === 'tulevat' ? 'Tulevat' : 'Menneet'}
            </Link>
          ))}
        </div>
        {Object.entries(grouped).length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500 text-sm">
              {filter === 'tulevat' ? 'Ei tulevia otteluita.' :
               filter === 'menneet' ? 'Ei pelattuja otteluita vielä.' :
               'Otteluita ei löydy. Admin voi synkronoida pelit.'}
            </p>
          </div>
        )}
        {Object.entries(grouped).map(([date, dayMatches]) => (
          <div key={date}>
            <h2 className="text-lg font-black text-slate-200 uppercase tracking-tight mb-2">{date}</h2>
            <div className="space-y-2">
              {dayMatches.map((match: Match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  prediction={predictionMap.get(match.id) ?? null}
                  stats={computeStats(allPredsByMatch.get(match.id) ?? [], match)}
                  revealedPreds={revealedPredsByMatch.get(match.id) ?? []}
                />
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}

function groupByDate(matches: Match[]) {
  return matches.reduce<Record<string, Match[]>>((acc, match) => {
    const date = new Date(match.match_date).toLocaleDateString('fi-FI', {
      weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Helsinki',
    })
    if (!acc[date]) acc[date] = []
    acc[date].push(match)
    return acc
  }, {})
}
