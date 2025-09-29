import { useState } from "react";

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <button
        className="w-full text-left px-4 py-3 flex items-center justify-between"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="font-medium">{q}</span>
        <span className="text-slate-500">{open ? "–" : "+"}</span>
      </button>
      {open && <div className="px-4 pb-4 text-sm text-slate-700">{a}</div>}
    </div>
  );
}

export default function About() {
  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-white p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">About This App</h1>
        <p className="mt-2 text-slate-700 max-w-prose">
          A focused, end-to-end demo of housing price prediction with a clean React + Vite frontend,
          an Express gateway, and a Python ML service. Built for clarity, extensibility, and learning.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs">
          {["React", "Vite", "Tailwind (v4)", "Express", "FastAPI", "scikit-learn", "Chart.js"].map((t) => (
            <span key={t} className="px-2 py-1 rounded border border-slate-300 bg-white">{t}</span>
          ))}
        </div>
      </section>

      {/* VALUE + FEATURES */}
      <section className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="text-base font-semibold">What problem does it solve?</div>
          <p className="mt-2 text-sm text-slate-700">
            Quickly estimate a fair price for a home using well-known predictive features such as
            living area, bathrooms, garage capacity, and neighborhood. The interface surfaces key
            insights and uncertainty so you understand the “why” behind numbers.
          </p>
          <ul className="mt-3 text-sm text-slate-700 space-y-1 list-disc ml-5">
            <li>Fast, interactive predictions</li>
            <li>Clear uncertainty band (±%) based on model quality</li>
            <li>Self-contained demo you can extend or productionize</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="text-base font-semibold">Key features</div>
          <ul className="mt-3 text-sm text-slate-700 space-y-2">
            <li>🧮 Predict page with grouped, accessible inputs + live summary</li>
            <li>📈 Visualizations: line, bar, scatter with a vivid palette</li>
            <li>📜 History saved locally with CSV export</li>
            <li>🔒 Privacy-friendly: no server login or profile required</li>
            <li>🧱 Simple architecture: React ↔ Express ↔ FastAPI</li>
          </ul>
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="text-base font-semibold">Architecture at a glance</div>
        <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="font-semibold">Frontend</div>
            <p className="text-slate-700 mt-1">React + Vite + Tailwind v4. SPA with React Router.</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="font-semibold">Gateway</div>
            <p className="text-slate-700 mt-1">Node/Express REST API: `/api/predict`, `/api/aggregates`.</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="font-semibold">ML Service</div>
            <p className="text-slate-700 mt-1">FastAPI + scikit-learn model (e.g., RandomForest).</p>
          </div>
        </div>
        <div className="mt-4 text-xs text-slate-500">
          Flow: Browser → Express → FastAPI → Model → Response (price + meta) → UI.
        </div>
      </section>

      {/* FAQ */}
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="text-base font-semibold mb-3">FAQ</div>
        <div className="grid md:grid-cols-2 gap-3">
          <FAQ
            q="How accurate is the model?"
            a="We display the holdout R² the backend returns. Real-world accuracy depends on data coverage and market drift. The UI also shows an uncertainty range."
          />
          <FAQ
            q="Where is my data stored?"
            a="Predictions you save are stored locally in your browser’s localStorage. You can clear or export them anytime."
          />
          <FAQ
            q="Can I bring my own dataset?"
            a="Yes. Extend the FastAPI service to load your CSV, retrain, and expose new endpoints. The frontend already expects JSON responses."
          />
          <FAQ
            q="How do I change the features?"
            a="Add fields to the form and include them in the payload to Express/FastAPI; retrain or update the model to use them."
          />
        </div>
      </section>

      {/* ROADMAP + CONTACT */}
      <section className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="text-base font-semibold">Roadmap</div>
          <ul className="mt-3 text-sm text-slate-700 space-y-2 list-disc ml-5">
            <li>Feature importance & partial dependence plots</li>
            <li>Neighborhood map overlay for geospatial context</li>
            <li>Authentication + cloud history sync (optional)</li>
            <li>Model versioning and comparison</li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="text-base font-semibold">Feedback & Support</div>
          <p className="mt-2 text-sm text-slate-700">
            Found a bug or want a feature? Open an issue in your repo, or reach out via your preferred channel.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <a
              href="/predict"
              className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700"
            >
              Try a prediction
            </a>
            <a
              href="/visuals"
              className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium border border-slate-300 bg-white hover:bg-slate-50 text-slate-900"
            >
              See visuals
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
