import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  Tooltip, Legend
} from "chart.js";
import { Line, Bar, Scatter } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

// Vivid palette
const COLORS = {
  teal:    "rgba(16, 185, 129, 0.9)",
  tealLt:  "rgba(16, 185, 129, 0.25)",
  indigo:  "rgba(99, 102, 241, 0.9)",
  indigoLt:"rgba(99, 102, 241, 0.25)",
  amber:   "rgba(245, 158, 11, 0.9)",
  amberLt: "rgba(245, 158, 11, 0.25)",
  rose:    "rgba(244, 63, 94, 0.9)",
  roseLt:  "rgba(244, 63, 94, 0.25)",
  sky:     "rgba(14, 165, 233, 0.9)",
  skyLt:   "rgba(14, 165, 233, 0.25)",
};

// Mock data (swap with API data when ready)
const years = [1950,1960,1970,1980,1990,2000,2010,2020];
const prices = [80,90,110,140,170,220,260,310];

const neigh = ["NAmes","CollgCr","OldTown","Edwards","Somerst","NridgHt","Sawyer","Gilbert"];
const neighAvg = [210,245,180,175,260,320,190,240];

const scatter = Array.from({length:60},(_,i)=>({
  x: 850 + i*25, y: 70 + ((i*7)%120), n: neigh[i % neigh.length]
}));

export default function Visualizations(){
  const lineData = {
    labels: years,
    datasets: [
      {
        label: "Avg Price (k$)",
        data: prices,
        borderColor: COLORS.teal,
        backgroundColor: COLORS.tealLt,
        tension: 0.25,
        fill: true,
        pointRadius: 3,
      }
    ]
  };

  const barData = {
    labels: neigh,
    datasets: [
      {
        label: "Avg (k$)",
        data: neighAvg,
        backgroundColor: [
          COLORS.indigo, COLORS.sky, COLORS.teal, COLORS.rose,
          COLORS.amber, COLORS.indigo, COLORS.sky, COLORS.teal
        ],
        borderColor: "rgba(15, 23, 42, 0.2)",
        borderWidth: 1,
      }
    ]
  };

  const scatterData = {
    datasets: [{
      label: "Homes",
      data: scatter.map(p => ({ x: p.x, y: p.y })),
      pointBackgroundColor: scatter.map((_,i)=> {
        const c = [COLORS.teal, COLORS.indigo, COLORS.amber, COLORS.rose, COLORS.sky][i % 5];
        return c;
      }),
      pointBorderColor: "rgba(15, 23, 42, 0.2)",
      pointRadius: 4,
    }]
  };

  const commonOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "top" }, tooltip: { mode: "nearest", intersect: false } } };

  return (
    <div className="space-y-6">
      {/* Insight strip */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50">
          <div className="text-sm font-semibold text-emerald-700">Long-term trend</div>
          <p className="text-xs text-emerald-900 mt-1">Average prices have risen over decades (inflation + amenities).</p>
        </div>
        <div className="p-4 rounded-lg border border-indigo-200 bg-indigo-50">
          <div className="text-sm font-semibold text-indigo-700">Location effect</div>
          <p className="text-xs text-indigo-900 mt-1">Some neighborhoods maintain consistently higher averages.</p>
        </div>
        <div className="p-4 rounded-lg border border-amber-200 bg-amber-50">
          <div className="text-sm font-semibold text-amber-800">Size vs. price</div>
          <p className="text-xs text-amber-900 mt-1">Larger homes usually cost more, but returns may diminish.</p>
        </div>
      </div>

      {/* Line */}
      <section className="p-5 rounded-xl border border-slate-200 bg-white">
        <h3 className="text-base font-semibold mb-2">Average price by year</h3>
        <div className="h-72">
          <Line data={lineData} options={{ ...commonOpts, scales: { y: { title: { display: true, text: "k$" } }, x: { title: { display: true, text: "Year" } } } }} />
        </div>
        <p className="text-xs text-slate-500 mt-2">Tip: If you provide server aggregates, plug them into this chart for realism.</p>
      </section>

      {/* Bar */}
      <section className="p-5 rounded-xl border border-slate-200 bg-white">
        <h3 className="text-base font-semibold mb-2">Average price by neighborhood</h3>
        <div className="h-72">
          <Bar data={barData} options={{ ...commonOpts, scales: { y: { title: { display: true, text: "k$" } } } }} />
        </div>
        <div className="flex flex-wrap gap-2 mt-3 text-xs">
          <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800">teal</span>
          <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-800">indigo</span>
          <span className="px-2 py-1 rounded bg-sky-100 text-sky-800">sky</span>
          <span className="px-2 py-1 rounded bg-rose-100 text-rose-800">rose</span>
          <span className="px-2 py-1 rounded bg-amber-100 text-amber-800">amber</span>
        </div>
      </section>

      {/* Scatter */}
      <section className="p-5 rounded-xl border border-slate-200 bg-white">
        <h3 className="text-base font-semibold mb-2">Living area vs price</h3>
        <div className="h-80">
          <Scatter
            data={scatterData}
            options={{
              ...commonOpts,
              scales: {
                x: { title: { display: true, text: "Sqft" } },
                y: { title: { display: true, text: "Price (k$)" } },
              }
            }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">Dots are colored with a 5-hue palette for readability.</p>
      </section>
    </div>
  );
}
