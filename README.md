# MM-Veikkaus 2026

Jalkapallon MM-kisaveikkaus-sovellus kaveri- ja työporukoille.

---

## Yleiskuvaus

Käyttäjät voivat veikkata kaikkien MM 2026 -pelien tuloksia. Sovelluksessa voi kuulua useaan eri porukkaan, ja jokainen porukka näkee oman tulostaulunsa. Pelit ja tulokset haetaan manuaalisesti football-data.org-rajapinnasta admin-sivun kautta.

---

## Pisteytysjärjestelmä

| Tulos | Pisteet |
|---|---|
| Oikea tulos (esim. 2–1 oikein) | 3 pistettä |
| Oikea voittaja tai tasapeli (lopputulos oikein, maalit väärin) | 1 piste |
| Väärä | 0 pistettä |

---

## Käyttäjäpolku

1. **Rekisteröityminen** — sähköposti + salasana, ei vaadi kutsukoodia
2. **Kirjautuminen** — tavallinen sisäänkirjautuminen
3. **Porukkoihin liittyminen** — kirjautuneena käyttäjä syöttää kutsukoodin `/liity`-sivulla; voi liittyä useampaan porukkaan
4. **Veikkaaminen** — käyttäjä veikkaa jokaisen pelin tuloksen ennen pelin alkua; veikkaus lukittuu kun peli alkaa
5. **Tulostaulu** — näyttää yhden porukan pisteet kerrallaan; jos useassa porukassa, voi valita minkä porukan tulostaulun näkee

---

## Admin-toiminnot

Sovelluksen omistaja (admin) pääsee `/admin`-sivulle, jossa voi:
- Luoda uusia kutsukoodeja (oma tai satunnainen)
- Poistaa kutsukoodeja käytöstä
- Synkronoida pelit ja tulokset football-data.orgista manuaalisesti

Admin tunnistetaan sähköpostin perusteella (`ADMIN_EMAIL`-ympäristömuuttuja).

---

## Tietokantarakenne

### `matches`
Pelien tiedot haetaan API:sta ja tallennetaan tähän tauluun.

| Sarake | Tyyppi | Kuvaus |
|---|---|---|
| id | serial | Pääavain |
| api_id | int | football-data.org:n pelin ID |
| home_team | text | Kotijoukkue |
| away_team | text | Vierasjoukkue |
| match_date | timestamptz | Pelin alkuaika |
| home_score | int | Kotijoukkueen maalit (null ennen peliä) |
| away_score | int | Vierasjoukkueen maalit (null ennen peliä) |
| status | text | SCHEDULED / IN_PLAY / FINISHED |
| stage | text | Lohkovaihe / Pudotuspelit jne. |

### `predictions`
Käyttäjien veikkaukset.

| Sarake | Tyyppi | Kuvaus |
|---|---|---|
| id | serial | Pääavain |
| user_id | uuid | Viittaus käyttäjään |
| match_id | int | Viittaus peliin |
| home_score | int | Veikkattu kotitulos |
| away_score | int | Veikkattu vierastulos |
| points | int | Lasketut pisteet (null kunnes peli päättyy) |

### `profiles`
Käyttäjäprofiilit (luodaan automaattisesti rekisteröityessä).

| Sarake | Tyyppi | Kuvaus |
|---|---|---|
| id | uuid | Viittaus auth.users |
| display_name | text | Näyttönimi (oletuksena sähköpostin alkuosa) |

### `invite_codes`
Kutsukoodit porukkoihin liittymistä varten.

| Sarake | Tyyppi | Kuvaus |
|---|---|---|
| code | text | Pääavain, esim. "MM2026" |
| is_active | boolean | Onko koodi voimassa |
| created_at | timestamptz | Luontiaika |

### `group_memberships`
Käyttäjien jäsenyydet porukkoihin (monta-moneen).

| Sarake | Tyyppi | Kuvaus |
|---|---|---|
| user_id | uuid | Viittaus käyttäjään |
| invite_code | text | Viittaus kutsukoodiin |
| joined_at | timestamptz | Liittymisaika |

---

## Tekninen pino

- **Frontend & Backend:** Next.js 16 (App Router, Server Components, Server Actions)
- **Tietokanta & Auth:** Supabase (PostgreSQL + Row Level Security)
- **Pelidata:** football-data.org REST API
- **Tyyli:** Tailwind CSS

---

## Ympäristömuuttujat

| Muuttuja | Kuvaus |
|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Supabase-projektin URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase anon-avain |
| SUPABASE_SERVICE_ROLE_KEY | Supabase service role -avain (admin-operaatioihin) |
| FOOTBALL_DATA_API_KEY | football-data.org API-avain |
| ADMIN_EMAIL | Admin-käyttäjän sähköposti |

---

## Sivukartta

| Reitti | Kuvaus |
|---|---|
| `/login` | Kirjautuminen ja rekisteröityminen |
| `/` | Pelilista ja veikkausten syöttö |
| `/liity` | Porukkoihin liittyminen kutsukoodilla |
| `/tulokset` | Tulostaulu (porukan mukaan suodatettuna) |
| `/admin` | Kutsukoodien hallinta ja pelien synkronointi (vain admin) |

---

## Toteutusjärjestys

- [x] Projektin pystytys (Next.js + Supabase)
- [x] Kirjautuminen ja rekisteröityminen (ei vaadi kutsukoodia)
- [x] Pelilista ja veikkausten tallennus
- [x] Veikkauksen lukitus pelin alkaessa (UI + palvelinpuolen validointi)
- [x] Tulostaulu porukan mukaan suodatettuna
- [x] Usean porukan tuki (group_memberships)
- [x] Admin-sivu kutsukoodien hallintaan
- [x] Football API -integraatio (manuaalinen synkronointi)
- [x] Automaattinen pisteiden laskenta synkronoinnin yhteydessä
- [x] Tilastot pelien kohdalla (ennen peliä: veikkausjakauma, jälkeen: onnistumisprosentti)
- [x] Admin voi syöttää tuloksen manuaalisesti API:n varana
- [x] Näyttönimen muokkaus suoraan veikkaussivulla
- [x] Mobiilinavigaatio — bottom navigation
- [x] Värimaailma ja brändäys — tumma violetti FIFA 2026 -henkinen teema
- [x] Pelilistan luettavuus — joukkueiden liput ja nimet suomeksi
- [ ] Salasanan nollaus — unohtunut salasana pitää voida palauttaa
- [ ] Aikavyöhyke — otteluajat näytetään UTC:nä, pitäisi näkyä +3h (EEST)
- [ ] Veikkausten paljastus — pelin alettua näytä mitä muut veikkasivat
- [ ] Suodatus — näytä vain tulevat / vain menneet ottelut erikseen
- [ ] Tyhjät tilat — paremmat viestit kun ei pelejä, ei veikkauksia tai ei porukkaläisiä
- [ ] Lataustilanteen parannus — skeleton-loader tai animaatio sivuja ladattaessa
- [ ] Julkaisu (Vercel)

### Ehkä myöhemmin
- [ ] Admin: automaattinen synkronointi — cron-ajo tulosten päivittämiseen
- [ ] Omien pisteiden erittely — näytä per ottelu mitä pisteitä sai
- [ ] Myöhään liittyneet — käsittely kun porukalle liittyy kisojen aikana
- [ ] Pudotuspelien pisteytys — jatkoaika ja rangaistuspotkut
