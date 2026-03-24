export default function SkeletonTable() {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-100 p-6 animate-pulse">
      {/* Header Falso */}
      <div className="h-6 bg-slate-200 rounded w-1/4 mb-6"></div>

      {/* Filas Falsas */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            <div className="h-10 w-10 bg-slate-200 rounded-full shrink-0"></div>
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-8 bg-slate-200 rounded w-16 ml-auto"></div>
          </div>
        ))}
      </div>
    </div>
  );
}