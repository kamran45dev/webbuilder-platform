import { Hono } from 'hono'
import { cors } from 'hono/cors'
import auth from './routes/auth.js'
import projects from './routes/projects.js'
import deploy from './routes/deploy.js'

const app = new Hono()

// CORS + preflight
app.use('/*', cors({
  origin: (origin) => origin ?? '*',
  allowMethods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowHeaders: ['Content-Type','Authorization'],
  credentials: true,
  maxAge: 86400
}))
app.options('/*', (c) => c.text('', 204))

// Health
app.get('/', (c) => c.json({ ok: true, service: 'WebBuilder API' }))

// Mount under /api (so frontend calls hit /api/…)
app.route('/api/auth', auth)
app.route('/api/projects', projects)
app.route('/api', deploy) // deploy routes: /api/projects/:id/deploy/...

export default app