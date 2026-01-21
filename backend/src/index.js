import './polyfills.js'

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import auth from './routes/auth.js'
import projects from './routes/projects.js'
import deploy from './routes/deploy.js'

const app = new Hono()

app.use('/*', cors({
  origin: ['http://localhost:5173'],
  credentials: true
}))

app.get('/', (c) => c.json({ message: 'WebBuilder API v1' }))

app.route('/auth', auth)
app.route('/projects', projects)
app.route('/', deploy)

export default app