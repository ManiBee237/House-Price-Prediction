import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import routes from './routes.js'
import { logger } from './logger.js'

dotenv.config()

const app = express()
app.use(helmet())
app.use(express.json({ limit: '1mb' }))
app.use(logger)
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' }))

app.get('/', (_req, res) => res.json({ name: 'house-price-express', ok: true }))
app.use('/api', routes)

const port = Number(process.env.PORT || 5000)
app.listen(port, () => console.log(`Express listening on :${port}`))