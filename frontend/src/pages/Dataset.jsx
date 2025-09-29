import { useMemo, useState } from 'react'


const allRows = [
    { SalePrice: 208500, GrLivArea: 1710, TotalBsmtSF: 856, GarageCars: 2, FullBath: 2, YearBuilt: 2003, Neighborhood: 'CollgCr', HouseStyle: '2Story', OverallQual: 7 },
    { SalePrice: 181500, GrLivArea: 1262, TotalBsmtSF: 1262, GarageCars: 2, FullBath: 2, YearBuilt: 1976, Neighborhood: 'Veenker', HouseStyle: '1Story', OverallQual: 6 },
    { SalePrice: 223500, GrLivArea: 1786, TotalBsmtSF: 920, GarageCars: 2, FullBath: 2, YearBuilt: 2001, Neighborhood: 'CollgCr', HouseStyle: '2Story', OverallQual: 7 },
    // ... duplicate or fetch from API in real app
]


export default function Dataset() {
    const [q, setQ] = useState('')
    const [page, setPage] = useState(1)
    const pageSize = 6


    const filtered = useMemo(() => allRows.filter(r => JSON.stringify(r).toLowerCase().includes(q.toLowerCase())), [q])
    const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
    const rows = filtered.slice((page - 1) * pageSize, page * pageSize)


    return (
        <section className="card p-5">
            <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-lg font-semibold">Dataset Preview</h2>
                <input placeholder="Search..." className="field max-w-xs" value={q} onChange={e => { setQ(e.target.value); setPage(1) }} />
            </div>
            <div className="overflow-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="text-left border-b">
                            {Object.keys(allRows[0]).map(k => <th key={k} className="py-2 pr-4">{k}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={i} className="border-b">
                                {Object.values(row).map((v, j) => <td key={j} className="py-2 pr-4">{String(v)}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end gap-2 mt-3">
                <button
  onClick={()=>setPage(p=>Math.max(1,p-1))}
  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium border border-slate-300 bg-white hover:bg-slate-50 text-slate-900"
>
  Prev
</button>
<div className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm">
  Page {page} / {pages}
</div>
<button
  onClick={()=>setPage(p=>Math.min(pages,p+1))}
  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium border border-slate-300 bg-white hover:bg-slate-50 text-slate-900"
>
  Next
</button>

            </div>
        </section>
    )
}