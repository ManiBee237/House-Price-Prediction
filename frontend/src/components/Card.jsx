export default function Card({ title, children, footer }){
return (
<div className="bg-white rounded-2xl shadow-soft p-5 border">
{title && <h2 className="text-lg font-semibold mb-3">{title}</h2>}
<div>{children}</div>
{footer && <div className="mt-4 pt-3 border-t text-sm textgray-600">{footer}</div>}
</div>
)
}
