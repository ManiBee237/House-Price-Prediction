import { useMemo, useState, useEffect } from "react";
import axios from "axios";

const neighborhoods = ["NAmes", "CollgCr", "OldTown", "Edwards", "Somerst", "NridgHt", "Sawyer", "Gilbert"];
const houseStyles = ["1Story", "2Story", "1.5Fin", "SLvl", "SFoyer"];

function AnimatedNumber({ value, duration = 500 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (typeof value !== "number") return;
    const start = performance.now();
    const from = display || 0;
    const delta = value - from;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      setDisplay(Math.round(from + delta * p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <>{display.toLocaleString()}</>;
}

/** Heuristic uncertainty band:
 * If r2 provided: band ~ price * (1 - r2) * 0.35 (clamped 5–25%)
 * Else: default 10%
*/
function priceBand(price, r2) {
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const pct = typeof r2 === "number" ? clamp((1 - r2) * 0.35, 0.05, 0.25) : 0.10;
  const delta = price * pct;
  return { low: Math.max(0, price - delta), high: price + delta, pct };
}

export default function Predict() {
  const [form, setForm] = useState({
    GrLivArea: 1500, TotalBsmtSF: 800, GarageCars: 2, FullBath: 2,
    YearBuilt: 2000, Neighborhood: neighborhoods[0], HouseStyle: houseStyles[0], OverallQual: 5,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const change = (k) => (e) => setForm((p) => ({ ...p, [k]: e?.target ? e.target.value : e }));

  const summary = useMemo(
    () => `${form.Neighborhood} • ${form.HouseStyle} • ${form.GrLivArea} sqft • OQ ${form.OverallQual}`,
    [form]
  );

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const payload = {
        ...form,
        GrLivArea: +form.GrLivArea,
        TotalBsmtSF: +form.TotalBsmtSF,
        GarageCars: +form.GarageCars || 0,   // ensure number
        FullBath: +form.FullBath,
        YearBuilt: +form.YearBuilt,
        OverallQual: +form.OverallQual
      }

      const { data } = await axios.post("http://localhost:5000/api/predict", payload);
      setResult(data);
    } catch {
      setResult({ error: "Prediction failed. Check backend services." });
    } finally { setLoading(false); }
  }

  function demo() {
    setForm({ GrLivArea: 1850, TotalBsmtSF: 950, GarageCars: 2, FullBath: 2, YearBuilt: 2005, Neighborhood: "CollgCr", HouseStyle: "2Story", OverallQual: 7 });
  }

  function saveHistory() {
    if (!result?.predicted_price) return;
    const row = { ...form, predicted: result.predicted_price, at: new Date().toISOString() };
    const prev = JSON.parse(localStorage.getItem("hp-history") || "[]");
    localStorage.setItem("hp-history", JSON.stringify([row, ...prev].slice(0, 200)));
  }

  const band = result?.predicted_price ? priceBand(result.predicted_price, result?.r2_meta) : null;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Form */}
      <section className="p-5 rounded-xl border border-slate-200 bg-white">
        <h2 className="text-lg font-semibold mb-4">Enter property details</h2>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Size */}
          <div>
            <div className="text-base font-semibold text-slate-900 mb-2">📏 Size</div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="GrLivArea">Living area (sqft)</label>
                <input id="GrLivArea" type="number" min={100}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                  value={form.GrLivArea} onChange={change("GrLivArea")} required />
                <p className="text-xs text-slate-500 mt-1">Above-ground finished area.</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="TotalBsmtSF">Basement (sqft)</label>
                <input id="TotalBsmtSF" type="number" min={0}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                  value={form.TotalBsmtSF} onChange={change("TotalBsmtSF")} required />
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <div className="text-base font-semibold text-slate-900 mb-2">🛠 Features</div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="GarageCars">Garage cars</label>
                <input id="GarageCars" type="number" min={0} max={5}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                  value={form.GarageCars} onChange={change("GarageCars")} required />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="FullBath">Full baths</label>
                <input id="FullBath" type="number" min={0} max={5}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                  value={form.FullBath} onChange={change("FullBath")} required />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="OverallQual">Overall quality (1–10)</label>
                <input id="OverallQual" type="range" min="1" max="10"
                  className="w-full accent-emerald-600"
                  value={form.OverallQual} onChange={change("OverallQual")} />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <div className="text-base font-semibold text-slate-900 mb-2">📍 Location</div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="YearBuilt">Year built</label>
                <input id="YearBuilt" type="number" min={1800} max={2025}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                  value={form.YearBuilt} onChange={change("YearBuilt")} required />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="Neighborhood">Neighborhood</label>
                <select id="Neighborhood"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white pr-8"
                  value={form.Neighborhood} onChange={change("Neighborhood")}>
                  {neighborhoods.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="HouseStyle">House style</label>
                <select id="HouseStyle"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white pr-8"
                  value={form.HouseStyle} onChange={change("HouseStyle")}>
                  {houseStyles.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? "Predicting…" : "Predict"}
            </button>
            <button
              type="button"
              onClick={demo}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium border border-slate-300 bg-white hover:bg-slate-50 text-slate-900"
            >
              Try demo
            </button>
          </div>
        </form>
      </section>

      {/* Result + More details */}
      <section className="p-5 rounded-xl border border-slate-200 bg-white lg:col-span-2">
        <h2 className="text-lg font-semibold">Estimated price</h2>
        <p className="text-xs text-slate-500 mt-1">{summary}</p>

        {!result && !loading && <p className="mt-4 text-slate-600">Fill the form and click Predict.</p>}
        {loading && (
          <div className="mt-6 space-y-3">
            <div className="h-10 w-64 rounded-lg bg-slate-200 animate-pulse"></div>
            <div className="h-4 w-48 rounded bg-slate-200 animate-pulse"></div>
            <div className="h-9 w-40 rounded-lg bg-slate-200 animate-pulse"></div>
          </div>
        )}
        {result?.error && <p className="mt-4 text-red-600">{result.error}</p>}

        {result?.predicted_price && !loading && (
          <div className="mt-4 space-y-6">
            <div className="text-5xl font-extrabold text-emerald-600">
              $<AnimatedNumber value={Math.round(result.predicted_price)} />
            </div>
            {typeof result.r2_meta === "number" && (
              <div className="text-xs text-slate-500">Model R² (holdout): {result.r2_meta.toFixed(3)}</div>
            )}

            {/* 🔎 Additional info: range + notes + recap */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Range */}
              <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50">
                <div className="text-sm font-semibold text-emerald-700">Estimated range</div>
                <div className="mt-1 text-emerald-800 font-bold">
                  ${Math.round(band.low).toLocaleString()} – ${Math.round(band.high).toLocaleString()}
                </div>
                <div className="text-xs text-emerald-700/80 mt-1">±{Math.round(band.pct * 100)}% heuristic band</div>
              </div>

              {/* Assumptions */}
              <div className="p-4 rounded-lg border border-indigo-200 bg-indigo-50">
                <div className="text-sm font-semibold text-indigo-700">Assumptions</div>
                <ul className="mt-1 text-xs text-indigo-900 list-disc ml-4 space-y-1">
                  <li>Features are complete & valid</li>
                  <li>Neighborhood encodings match training</li>
                  <li>Market conditions similar to training period</li>
                </ul>
              </div>

              {/* Quick recap */}
              <div className="p-4 rounded-lg border border-amber-200 bg-amber-50">
                <div className="text-sm font-semibold text-amber-800">Quick recap</div>
                <div className="mt-1 text-xs text-amber-900">
                  {form.GrLivArea} sqft, {form.FullBath} bath, {form.GarageCars} garage, built {form.YearBuilt}.<br />
                  {form.Neighborhood} • {form.HouseStyle} • OQ {form.OverallQual}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveHistory}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Save to history
              </button>
              <a
                href="/visuals"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium border border-slate-300 bg-white hover:bg-slate-50 text-slate-900"
              >
                See visuals
              </a>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
