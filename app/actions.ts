'use server'

import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { randomBytes } from 'crypto'

const STAGE_MAP: Record<string, string> = {
  GROUP_STAGE: 'Lohkovaihe',
  ROUND_OF_16: 'Kahdeksasfinaalit',
  QUARTER_FINALS: 'Puolivälierät',
  SEMI_FINALS: 'Välierät',
  THIRD_PLACE: 'Pronssiottelu',
  FINAL: 'Finaali',
}

function calcPoints(ph: number, pa: number, ah: number, aa: number): number {
  if (ph === ah && pa === aa) return 3
  if (Math.sign(ph - pa) === Math.sign(ah - aa)) return 1
  return 0
}

export async function syncMatches() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.email !== process.env.ADMIN_EMAIL) return { error: 'Ei oikeuksia' }

  const admin = createAdminClient()

  const res = await fetch(
    'https://api.football-data.org/v4/competitions/WC/matches',
    { headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY! }, next: { revalidate: 0 } }
  )

  if (!res.ok) return { error: `API-virhe: ${res.status} ${res.statusText}` }

  const json = await res.json()
  const matches = json.matches ?? []

  if (matches.length === 0) return { error: 'API ei palauttanut pelejä' }

  const upsertData = matches
    .filter((m: any) => m.homeTeam?.name && m.awayTeam?.name)
    .map((m: any) => ({
      api_id: m.id,
      home_team: m.homeTeam.name,
      away_team: m.awayTeam.name,
      match_date: m.utcDate,
      status: ['FINISHED', 'IN_PLAY', 'PAUSED'].includes(m.status) ? m.status : 'SCHEDULED',
      stage: STAGE_MAP[m.stage] ?? m.stage,
      home_score: m.score?.fullTime?.home ?? null,
      away_score: m.score?.fullTime?.away ?? null,
    }))

  const { error: upsertError } = await admin
    .from('matches')
    .upsert(upsertData, { onConflict: 'api_id' })

  if (upsertError) return { error: upsertError.message }

  // Päivitä pisteet valmistuneille peleille
  const finished = upsertData.filter(
    (m: any) => m.status === 'FINISHED' && m.home_score !== null && m.away_score !== null
  )

  if (finished.length > 0) {
    const { data: dbMatches } = await admin
      .from('matches')
      .select('id, api_id, home_score, away_score')
      .in('api_id', finished.map((m: any) => m.api_id))

    const matchMap = new Map((dbMatches ?? []).map((m) => [m.api_id, m]))

    const { data: preds } = await admin
      .from('predictions')
      .select('id, match_id, home_score, away_score')
      .in('match_id', (dbMatches ?? []).map((m) => m.id))

    for (const pred of preds ?? []) {
      const match = [...matchMap.values()].find((m) => m.id === pred.match_id)
      if (!match) continue
      const points = calcPoints(pred.home_score, pred.away_score, match.home_score, match.away_score)
      await admin.from('predictions').update({ points }).eq('id', pred.id)
    }
  }

  revalidatePath('/')
  revalidatePath('/tulokset')
  return { success: true, count: matches.length }
}

export async function requestPasswordReset(_: unknown, formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const { headers } = await import('next/headers')
  const headerStore = await headers()
  const host = headerStore.get('host') ?? 'localhost:3000'
  const protocol = host.startsWith('localhost') ? 'http' : 'https'
  const redirectTo = `${protocol}://${host}/auth/callback?next=/reset-password`

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
  if (error) return { error: error.message }
  return { success: true }
}

export async function updatePassword(_: unknown, formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: error.message }
  redirect('/')
}

export async function login(_: unknown, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })
  if (error) return { error: error.message }
  redirect('/')
}

export async function register(_: unknown, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })
  if (error) return { error: error.message }
  redirect('/')
}

export async function joinGroup(_: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Ei kirjautunut' }

  const code = (formData.get('invite_code') as string).trim().toUpperCase()

  const { data: invite } = await supabase
    .from('invite_codes')
    .select('is_active')
    .eq('code', code)
    .single()

  if (!invite?.is_active) return { error: 'Virheellinen tai vanhentunut kutsukoodi' }

  const has_stake = formData.get('has_stake') === 'on'

  const { error } = await supabase.from('group_memberships').insert({
    user_id: user.id,
    invite_code: code,
    has_stake,
  })

  if (error) {
    if (error.code === '23505') return { error: 'Olet jo tässä porukassa' }
    return { error: error.message }
  }

  revalidatePath('/tulokset')
  return { success: true, code }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function savePrediction(_: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Ei kirjautunut' }

  const matchId = Number(formData.get('match_id'))
  const homeScore = Number(formData.get('home_score'))
  const awayScore = Number(formData.get('away_score'))

  const { data: match } = await supabase
    .from('matches')
    .select('status')
    .eq('id', matchId)
    .single()

  if (!match || match.status !== 'SCHEDULED') {
    return { error: 'Peli on jo alkanut, veikkausta ei voi enää muuttaa' }
  }

  const { error } = await supabase.from('predictions').upsert(
    { user_id: user.id, match_id: matchId, home_score: homeScore, away_score: awayScore },
    { onConflict: 'user_id,match_id' }
  )

  if (error) return { error: error.message }
  revalidatePath('/')
  return { success: true }
}

export async function markOnboarded() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('profiles').update({ onboarded: true }).eq('id', user.id)
  redirect('/liity')
}

export async function updateDisplayName(_: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Ei kirjautunut' }

  const name = (formData.get('display_name') as string).trim()
  if (!name) return { error: 'Nimi ei voi olla tyhjä' }
  if (name.length > 30) return { error: 'Nimi voi olla enintään 30 merkkiä' }

  const { error } = await supabase
    .from('profiles')
    .update({ display_name: name })
    .eq('id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/')
  return { success: true }
}

export async function createInviteCode(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.email !== process.env.ADMIN_EMAIL) return

  const customCode = (formData.get('custom_code') as string | null)?.trim().toUpperCase()
  const code = customCode || randomBytes(3).toString('hex').toUpperCase()

  const { error } = await supabase.from('invite_codes').insert({ code })
  if (error) { console.error('createInviteCode:', error.message); return }
  revalidatePath('/admin')
}

export async function updateMatchResult(_: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.email !== process.env.ADMIN_EMAIL) return { error: 'Ei oikeuksia' }

  const admin = createAdminClient()
  const matchId = Number(formData.get('match_id'))
  const homeScore = Number(formData.get('home_score'))
  const awayScore = Number(formData.get('away_score'))

  if (
    !Number.isInteger(homeScore) || !Number.isInteger(awayScore) ||
    homeScore < 0 || awayScore < 0 || homeScore > 20 || awayScore > 20
  ) {
    return { error: 'Virheellinen tulos' }
  }

  const { error } = await admin
    .from('matches')
    .update({ home_score: homeScore, away_score: awayScore, status: 'FINISHED' })
    .eq('id', matchId)

  if (error) return { error: error.message }

  const { data: preds } = await admin
    .from('predictions')
    .select('id, home_score, away_score')
    .eq('match_id', matchId)

  for (const pred of preds ?? []) {
    const points = calcPoints(pred.home_score, pred.away_score, homeScore, awayScore)
    await admin.from('predictions').update({ points }).eq('id', pred.id)
  }

  revalidatePath('/')
  revalidatePath('/tulokset')
  return { success: true }
}

export async function toggleInviteCode(code: string, isActive: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.email !== process.env.ADMIN_EMAIL) return

  await supabase.from('invite_codes').update({ is_active: isActive }).eq('code', code)
  revalidatePath('/admin')
}
