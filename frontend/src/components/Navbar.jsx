import { NavLink } from 'react-router-dom'
const linkClass = ({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium
transition-colors ${
isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-200'
}`
export default function Navbar(){
return (
<header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
<div className="max-w-6xl mx-auto px-4 h-14 flex items-center justifybetween">
<div className="flex items-center gap-2 font-semibold">
<span className="w-2.5 h-2.5 rounded-full bg-brand"></span>
House Price
</div>
<nav className="flex gap-1">
<NavLink to="/" className={linkClass}>Home</NavLink>
<NavLink to="/predict" className={linkClass}>Predict</NavLink>
<NavLink to="/visuals" className={linkClass}>Visuals</NavLink>
<NavLink to="/history" className={linkClass}>History</NavLink>
<NavLink to="/dataset" className={linkClass}>Dataset</NavLink>
<NavLink to="/about" className={linkClass}>About</NavLink>
</nav>
</div>
</header>
)
}
