import { createClient } from '@/lib/supabase-server'
import { logout } from '@/app/actions'
import PredictionForm from '@/app/components/PredictionForm'
import DisplayNameEditor from '@/app/components/DisplayNameEditor'
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
        {hw > 0 && <div className="bg-blue-400" style={{ width: `${hw}%` }} />}
        {dr > 0 && <div className="bg-gray-300" style={{ width: `${dr}%` }} />}
        {aw > 0 && <div className="bg-red-400" style={{ width: `${aw}%` }} />}
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>{homeTeam.split(' ')[0]} {hw}%</span>
        <span>Tasapeli {dr}%</span>
        <span>{aw}% {awayTeam.split(' ')[0]}</span>
      </div>
      <p className="text-xs text-gray-400 text-center">{stats.total} veikkausta</p>
    </div>
  )
}

function FinishedStats({ stats }: { stats: MatchStats }) {
  if (stats.total === 0) return null
  const exactPct = Math.round((stats.exactCorrect / stats.total) * 100)
  const outcomePct = Math.round(((stats.exactCorrect + stats.outcomeCorrect) / stats.total) * 100)
  return (
    <div className="mt-2 flex gap-3 text-xs text-gray-500">
      <span>Oikea tulos: <span className="font-medium text-gray-700">{stats.exactCorrect}/{stats.total} ({exactPct}%)</span></span>
      <span>·</span>
      <span>Oikea lopputulos: <span className="font-medium text-gray-700">{stats.exactCorrect + stats.outcomeCorrect}/{stats.total} ({outcomePct}%)</span></span>
    </div>
  )
}

function PointsBadge({ points }: { points: number | null }) {
  if (points === null) return null
  const styles =
    points === 3 ? 'bg-green-100 text-green-700' :
    points === 1 ? 'bg-yellow-100 text-yellow-700' :
    'bg-gray-100 text-gray-500'
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${styles}`}>
      {points}p
    </span>
  )
}

function MatchCard({ match, prediction, stats }: { match: Match; prediction: Prediction | null; stats: MatchStats }) {
  const time = new Date(match.match_date).toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' })
  const isScheduled = match.status === 'SCHEDULED'
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED'
  const isFinished = match.status === 'FINISHED'
  const hasPrediction = prediction !== null

  const borderColor =
    isFinished ? 'border-l-gray-300' :
    isLive ? 'border-l-amber-400' :
    hasPrediction ? 'border-l-green-400' :
    'border-l-orange-400'

  return (
    <div className={`bg-white rounded-xl border border-l-4 ${borderColor} px-4 py-3`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{time}</span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-400">{match.stage}</span>
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse inline-block" />
              Käynnissä
            </span>
          )}
          {isFinished && <PointsBadge points={prediction?.points ?? null} />}
          {isScheduled && !hasPrediction && (
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
              Veikkaamatta
            </span>
          )}
          {isScheduled && hasPrediction && (
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              Veikattu
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-sm flex-1">{match.home_team}</span>
        {isFinished ? (
          <span className="font-bold text-base font-mono bg-gray-100 rounded px-3 py-0.5 shrink-0">
            {match.home_score} – {match.away_score}
          </span>
        ) : (
          <span className="text-gray-300 text-sm shrink-0">vs</span>
        )}
        <span className="font-semibold text-sm flex-1 text-right">{match.away_team}</span>
      </div>

      {isScheduled && (
        <PredictionForm matchId={match.id} prediction={prediction} />
      )}

      {(isLive || isFinished) && (
        <div className="mt-2 text-xs text-gray-500">
          {hasPrediction ? (
            <span>
              Veikkauksesi:{' '}
              <span className="font-mono font-medium text-gray-700">
                {prediction!.home_score} – {prediction!.away_score}
              </span>
            </span>
          ) : (
            <span className="italic text-gray-400">Ei veikkausta</span>
          )}
        </div>
      )}

      {isScheduled && hasPrediction && (
        <OutcomeBar stats={stats} homeTeam={match.home_team} awayTeam={match.away_team} />
      )}

      {isFinished && <FinishedStats stats={stats} />}
    </div>
  )
}

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: matches }, { data: myPredictions }, { data: allPredictions }, { data: profile }] = await Promise.all([
    supabase.from('matches').select('*').order('match_date'),
    supabase.from('predictions').select('*').eq('user_id', user!.id),
    supabase.from('predictions').select('match_id, home_score, away_score, points'),
    supabase.from('profiles').select('display_name').eq('id', user!.id).single(),
  ])

  const predictionMap = new Map<number, Prediction>(
    (myPredictions ?? []).map((p: Prediction) => [p.match_id, p])
  )

  const allPredsByMatch = new Map<number, Prediction[]>()
  for (const p of allPredictions ?? []) {
    const existing = allPredsByMatch.get(p.match_id) ?? []
    existing.push(p)
    allPredsByMatch.set(p.match_id, existing)
  }

  const allMatches = matches ?? []
  const scheduled = allMatches.filter((m) => m.status === 'SCHEDULED')
  const missing = scheduled.filter((m) => !predictionMap.has(m.id)).length
  const grouped = groupByDate(allMatches)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-bold text-lg">MM-Veikkaus 2026</h1>
          <div className="flex items-center gap-3">
            <Link href="/tulokset" className="hidden md:block text-sm text-blue-600 hover:underline">Tulostaulu</Link>
            <Link href="/liity" className="hidden md:block text-sm text-blue-600 hover:underline">Liity porukkaan</Link>
            {user!.email === process.env.ADMIN_EMAIL && (
              <Link href="/admin" className="text-sm text-gray-400 hover:underline">Admin</Link>
            )}
            <form action={logout}>
              <button className="text-sm text-gray-500 hover:text-gray-800">Ulos</button>
            </form>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 pb-2 flex items-center justify-between">
          <DisplayNameEditor name={profile?.display_name ?? user!.email!} />
          {missing > 0 && (
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
              {missing} veikkausta tekemättä
            </span>
          )}
          {missing === 0 && scheduled.length > 0 && (
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              Kaikki veikattu
            </span>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6 space-y-6">
        {Object.entries(grouped).map(([date, dayMatches]) => (
          <div key={date}>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">{date}</h2>
            <div className="space-y-2">
              {dayMatches.map((match: Match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  prediction={predictionMap.get(match.id) ?? null}
                  stats={computeStats(allPredsByMatch.get(match.id) ?? [], match)}
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
      weekday: 'long', day: 'numeric', month: 'long'
    })
    if (!acc[date]) acc[date] = []
    acc[date].push(match)
    return acc
  }, {})
}
