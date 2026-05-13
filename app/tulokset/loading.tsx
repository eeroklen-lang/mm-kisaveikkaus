export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <h1 className="font-black text-lg text-slate-100 uppercase tracking-tight">Tulostaulu</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-32 md:pb-6 space-y-4 animate-pulse">
        <div className="h-7 w-48 bg-slate-700 rounded" />
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="border-b border-slate-700 bg-slate-700/50 px-4 py-2 flex gap-4">
            <div className="h-4 w-6 bg-slate-600 rounded" />
            <div className="h-4 w-24 bg-slate-600 rounded flex-1" />
            <div className="h-4 w-10 bg-slate-600 rounded" />
            <div className="h-4 w-10 bg-slate-600 rounded" />
          </div>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-b border-slate-700 last:border-0 px-4 py-3 flex items-center gap-4">
              <div className="h-4 w-4 bg-slate-700 rounded" />
              <div className="h-4 bg-slate-700 rounded flex-1" />
              <div className="h-4 w-8 bg-slate-700 rounded" />
              <div className="h-4 w-8 bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
