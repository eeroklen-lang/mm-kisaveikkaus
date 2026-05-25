import { markOnboarded } from '@/app/actions'

export default function WelcomeModal() {

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-sm w-full p-6 space-y-4">
        <div className="text-center">
          <h2 className="font-black text-xl text-slate-100 uppercase tracking-tight">Tervetuloa!</h2>
          <p className="text-slate-400 text-sm mt-1">MM-Veikkaus 2026</p>
        </div>

        <p className="text-slate-300 text-sm">
          Veikkaa jokaisen ottelun tulos ennen pelin alkua. Mitä tarkempi arvaus, sitä enemmän pisteitä.
        </p>

        <div className="bg-slate-700 rounded-xl p-4 space-y-2">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-medium mb-3">Pisteytysjärjestelmä</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">Oikea tulos (esim. 2–1)</span>
            <span className="font-black text-green-400">3p</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">Oikea voittaja / tasapeli</span>
            <span className="font-black text-yellow-400">1p</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">Väärä</span>
            <span className="font-black text-slate-500">0p</span>
          </div>
        </div>

        <p className="text-slate-400 text-sm">
          Liity porukkaan kutsukoodilla nähdäksesi muiden pisteet tulostaululla.
        </p>

        <form action={markOnboarded}>
          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-xl transition-colors"
          >
            Liity porukkaan
          </button>
        </form>
      </div>
    </div>
  )
}
