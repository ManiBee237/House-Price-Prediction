import { useEffect, useMemo, useState } from "react";

export default function Home() {
  // Pull a few stats from localStorage history
  const [history, setHistory] = useState([]);
  useEffect(() => {
    try {
      const rows = JSON.parse(localStorage.getItem("hp-history") || "[]");
      setHistory(rows);
    } catch {
      setHistory([]);
    }
  }, []);

  const kpis = useMemo(() => {
    if (!history.length) return { total: 0, avg: 0, lastR2: null };
    const prices = history.map((r) => Number(r.predicted)).filter((n) => Number.isFinite(n));
    const avg = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
    const lastR2 = history.find((r) => typeof r.r2_meta === "number")?.r2_meta ?? null;
    return { total: history.length, avg, lastR2 };
  }, [history]);

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              Your House Price Predicter
            </h1>
            <p className="mt-2 text-slate-700 max-w-prose">
              Estimate prices instantly, explore trends by neighborhood and year, and keep a history of
              your predictions — all in one place.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="/predict"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Start a new prediction
              </a>
              <a
                href="/visuals"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium border border-slate-300 bg-white hover:bg-slate-50 text-slate-900"
              >
                Explore visuals
              </a>
              <a
                href="/dataset"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium border border-slate-300 bg-white hover:bg-slate-50 text-slate-900"
              >
                View dataset
              </a>
            </div>
          </div>
          <div className="hidden md:block text-right min-w-[12rem]">
            <div className="text-xs uppercase tracking-wide text-slate-500">Last session</div>
            <div className="mt-1 text-sm text-slate-700">
              {history[0]?.at ? new Date(history[0].at).toLocaleString() : "—"}
            </div>
          </div>
        </div>
      </section>

      {/* KPI STRIP */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <div className="text-xs uppercase tracking-wide text-slate-500">Total predictions</div>
          <div className="mt-1 text-3xl font-extrabold text-slate-900">{kpis.total}</div>
          <div className="mt-1 text-xs text-slate-500">Saved in your browser</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <div className="text-xs uppercase tracking-wide text-slate-500">Average predicted price</div>
          <div className="mt-1 text-3xl font-extrabold text-emerald-600">
            ${kpis.avg ? kpis.avg.toLocaleString() : "0"}
          </div>
          <div className="mt-1 text-xs text-slate-500">Across your history</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <div className="text-xs uppercase tracking-wide text-slate-500">Model R² (last)</div>
          <div className="mt-1 text-3xl font-extrabold text-indigo-600">
            {kpis.lastR2 ? kpis.lastR2.toFixed(3) : "—"}
          </div>
          <div className="mt-1 text-xs text-slate-500">Quality indicator (holdout)</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <div className="text-xs uppercase tracking-wide text-slate-500">Dataset rows (sample)</div>
          <div className="mt-1 text-3xl font-extrabold text-amber-600">~2,900</div>
          <div className="mt-1 text-xs text-slate-500">Typical Ames training size</div>
        </div>
      </section>

      {/* QUICK ACTIONS + HOW IT WORKS */}
      <section className="grid lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="text-base font-semibold">Quick actions</div>
          <div className="mt-3 grid grid-cols-1 gap-2">
            <a href="/predict" className="px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50">
              🧮 New prediction
            </a>
            <a href="/history" className="px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50">
              📜 View history
            </a>
            <a href="/visuals" className="px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50">
              📈 Visualize trends
            </a>
            <a href="/about" className="px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50">
              ❓ Learn about the app
            </a>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="text-base font-semibold">How it works</div>
          <ol className="mt-3 space-y-2 text-sm text-slate-700 list-decimal ml-5">
            <li>Enter property features on <span className="font-medium">Predict</span>.</li>
            <li>Express forwards the request to the Python ML service.</li>
            <li>Model returns a price + quality metric (R²).</li>
            <li>Optionally save to local history and compare in <span className="font-medium">Visuals</span>.</li>
          </ol>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="text-base font-semibold">Why this app</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>✅ Clear UI with real-time feedback</li>
            <li>✅ Honest uncertainty band around predictions</li>
            <li>✅ Exportable history (CSV)</li>
            <li>✅ Simple, extensible codebase</li>
          </ul>
        </div>
      </section>

      {/* RECENT HISTORY */}
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="text-base font-semibold">Recent predictions</div>
          <a
            href="/history"
            className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-slate-300 bg-white hover:bg-slate-50 text-slate-900"
          >
            See all
          </a>
        </div>

        {!history.length ? (
          <p className="text-slate-600 mt-3">No predictions yet. Try one from the Predict page.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  {["When", "Price", "GrLivArea", "Bath", "Garage", "Year", "Neighborhood", "Style"].map((h) => (
                    <th key={h} className="py-2 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 5).map((r, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2 pr-4 whitespace-nowrap">{new Date(r.at).toLocaleString()}</td>
                    <td className="py-2 pr-4 font-semibold">${Number(r.predicted).toLocaleString()}</td>
                    <td className="py-2 pr-4">{r.GrLivArea}</td>
                    <td className="py-2 pr-4">{r.FullBath}</td>
                    <td className="py-2 pr-4">{r.GarageCars}</td>
                    <td className="py-2 pr-4">{r.YearBuilt}</td>
                    <td className="py-2 pr-4">{r.Neighborhood}</td>
                    <td className="py-2 pr-4">{r.HouseStyle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
