function SkeletonCard() {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 border-l-4 border-l-slate-700 px-4 py-3 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-16 bg-slate-700 rounded" />
        <div className="h-5 w-20 bg-slate-700 rounded-full" />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="h-4 w-28 bg-slate-700 rounded flex-1" />
        <div className="h-6 w-14 bg-slate-700 rounded shrink-0" />
        <div className="h-4 w-28 bg-slate-700 rounded flex-1" />
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-black text-lg text-slate-100 uppercase tracking-tight">MM-Veikkaus 2026</h1>
        </div>
        <div className="max-w-2xl mx-auto px-4 pb-2">
          <div className="h-4 w-32 bg-slate-700 rounded animate-pulse" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-32 md:pb-6 space-y-6">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-7 w-20 bg-slate-700 rounded-full animate-pulse" />
          ))}
        </div>
        {[0, 1].map((g) => (
          <div key={g}>
            <div className="h-5 w-40 bg-slate-700 rounded animate-pulse mb-2" />
            <div className="space-y-2">
              {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
