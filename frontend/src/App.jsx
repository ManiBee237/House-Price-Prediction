import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home.jsx";
import Predict from "./pages/Predict.jsx";
import Visualizations from "./pages/Visualizations.jsx";
import History from "./pages/History.jsx";
import Dataset from "./pages/Dataset.jsx";
import About from "./pages/About.jsx";

const active = ({ isActive }) =>
  (isActive
    ? "px-3 py-2 rounded-lg text-sm font-medium bg-slate-900 text-white"
    : "px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100");

function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  useEffect(() => {
    const root = document.documentElement;
    if (dark) { root.classList.add("dark"); localStorage.setItem("theme", "dark"); }
    else { root.classList.remove("dark"); localStorage.setItem("theme", "light"); }
  }, [dark]);
  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setDark((d) => !d)}
      className="inline-flex items-center justify-center gap-2 px-3 h-9 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-900"
    >
      {dark ? "🌙" : "🌞"}
    </button>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/home" className="flex items-center gap-2 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            House Price Predicter
          </a>
          <nav className="flex gap-1">
            <NavLink to="/home" className={active} end>Home</NavLink>
            <NavLink to="/predict" className={active}>Predict</NavLink>
            <NavLink to="/visuals" className={active}>Visuals</NavLink>
            <NavLink to="/history" className={active}>History</NavLink>
            <NavLink to="/dataset" className={active}>Dataset</NavLink>
            <NavLink to="/about" className={active}>About</NavLink>
          </nav>
          {/* <ThemeToggle /> */}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/visuals" element={<Visualizations />} />
          <Route path="/history" element={<History />} />
          <Route path="/dataset" element={<Dataset />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-200 py-8 mt-10">
        <div className="max-w-6xl mx-auto px-4 text-sm text-slate-500">
          © {new Date().getFullYear()} House Price Prediction
        </div>
      </footer>
    </div>
  );
}
