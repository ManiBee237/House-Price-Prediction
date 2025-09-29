    import { useEffect, useState } from 'react'
export default function ThemeToggle(){
  const [dark, setDark] = useState(() => localStorage.getItem('hp-theme') === 'dark')
  useEffect(() => {
    const root = document.documentElement
    if (dark) { root.classList.add('dark'); localStorage.setItem('hp-theme','dark') }
    else { root.classList.remove('dark'); localStorage.setItem('hp-theme','light') }
  }, [dark])
  return (
    <button className="btn-ghost" onClick={()=>setDark(d=>!d)} aria-label="Toggle dark mode">
      {dark ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}
