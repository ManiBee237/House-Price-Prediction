function toCSV(rows){
const cols = ['at','predicted','GrLivArea','TotalBsmtSF','GarageCars','FullBath','YearBuilt','Neighborhood','HouseStyle','OverallQual']
const head = cols.join(',')
const body = rows.map(r=> cols.map(c=> JSON.stringify(r[c] ?? '')).join(',')).join('')
return head + '' + body
}


export default function History(){
const rows = JSON.parse(localStorage.getItem('hp-history') || '[]')
const clear = () => { localStorage.removeItem('hp-history'); location.reload() }
const download = () => {
const blob = new Blob([toCSV(rows)], {type:'text/csv'})
const url = URL.createObjectURL(blob)
const a = document.createElement('a'); a.href = url; a.download = 'predictions.csv'; a.click(); URL.revokeObjectURL(url)
}


return (
<div className="space-y-4">
<div className="flex items-center justify-between">
<h2 className="text-xl font-bold">Prediction History</h2>
<div className="flex gap-2">
<button
  onClick={download}
  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700"
>
  Download CSV
</button>
<button
  onClick={clear}
  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium border border-slate-300 bg-white hover:bg-slate-50 text-slate-900"
>
  Clear
</button>

</div>
</div>


{rows.length === 0 ? (
<p className="text-gray-500">No saved predictions yet.</p>
) : (
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
{rows.map((r,i)=> (
<div key={i} className="card p-5">
<div className="text-sm text-gray-500">{new Date(r.at).toLocaleString()}</div>
<div className="mt-1 text-3xl font-extrabold text-teal-600">${Number(r.predicted).toLocaleString()}</div>
<div className="mt-2 text-sm text-gray-700">{r.Neighborhood} • {r.HouseStyle}</div>
<div className="mt-1 text-xs text-gray-500">{r.GrLivArea} sqft • OQ {r.OverallQual}</div>
</div>
))}
</div>
)}
</div>
)}