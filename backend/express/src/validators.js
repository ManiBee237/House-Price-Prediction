// Tiny guard rails; expand as needed
export function requireNumber(obj, key, { min = -Infinity, max = Infinity } = {}) {
  const v = Number(obj[key])
  if (!Number.isFinite(v)) throw new Error(`${key} must be a number`)
  if (v < min || v > max) throw new Error(`${key} out of range`)
  return v
} 

export function requireEnum(obj, key, allowed) {
  const v = obj[key]
  if (!allowed.includes(v)) throw new Error(`${key} must be one of: ${allowed.join(', ')}`)
  return v
}