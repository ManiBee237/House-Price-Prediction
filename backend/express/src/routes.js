import express from 'express'
import axios from 'axios'
import { requireNumber } from './validators.js'

const router = express.Router()

// Health
router.get('/health', (_req, res) => res.json({ ok: true }))

// ✅ helper for strings
function requireString(obj, key) {
  const v = obj[key]
  if (typeof v !== 'string' || !v.trim()) throw new Error(`${key} must be a non-empty string`)
  return v.trim()
}

// Predict — validates payload, proxies to FastAPI
router.post('/predict', async (req, res) => {
  try {
    const b = req.body || {}
    console.log('Incoming /predict body:', b) // DEBUG

    const num = (k, {min=-Infinity, max=Infinity}={}) => {
      const v = Number(b[k])
      if (!Number.isFinite(v)) throw new Error(`${k} must be a number`)
      if (v < min || v > max) throw new Error(`${k} out of range`)
      return v
    }
    const str = (k) => {
      const v = b[k]
      if (typeof v !== 'string' || !v.trim()) throw new Error(`${k} must be a non-empty string`)
      return v.trim()
    }

    const payload = {
      GrLivArea:   num('GrLivArea',   { min: 100 }),
      TotalBsmtSF: num('TotalBsmtSF', { min: 0 }),
      GarageCars:  num('GarageCars',  { min: 0, max: 5 }),
      FullBath:    num('FullBath',    { min: 0, max: 5 }),
      YearBuilt:   num('YearBuilt',   { min: 1800, max: 2100 }),
      Neighborhood: str('Neighborhood'),
      HouseStyle:   str('HouseStyle'),
      OverallQual: num('OverallQual', { min: 1, max: 10 }),
    }

    const { FASTAPI_URL } = process.env
    const { data } = await axios.post(`${FASTAPI_URL}/predict`, payload, {
      timeout: Number(process.env.REQUEST_TIMEOUT_MS || 8000),
    })
    res.json(data)
  } catch (err) {
    const status = err.response?.status || 400
    const upstream = err.response?.data
    console.error('Predict error:', { status, message: err.message, upstream })
    res.status(status).json({ error: upstream?.detail || upstream?.error || err.message || 'Bad Request' })
  }
})


// Aggregates
router.get('/aggregates', async (_req, res) => {
  try {
    const { FASTAPI_URL } = process.env
    const { data } = await axios.get(`${FASTAPI_URL}/aggregates`)
    res.json(data)
  } catch (err) {
    console.error('Aggregates error:', err.response?.data || err.message)
    res.status(500).json({ error: 'Failed to fetch aggregates' })
  }
})

export default router
