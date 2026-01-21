import { Hono } from 'hono'
import { authMiddleware } from '../utils/auth.js'

const projects = new Hono()

projects.use('/*', authMiddleware)

// Get all projects
projects.get('/', async (c) => {
  const userId = c.get('userId')
  const result = await c.env.DB.prepare('SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC').bind(userId).all()
  return c.json({ projects: result.results })
})

// Create project
projects.post('/', async (c) => {
  const userId = c.get('userId')
  const { name } = await c.req.json()

  const result = await c.env.DB.prepare('INSERT INTO projects (user_id, name) VALUES (?, ?) RETURNING *').bind(userId, name || 'Untitled Project').first()

  // Create default home page
  await c.env.DB.prepare('INSERT INTO pages (project_id, title, slug, is_home) VALUES (?, ?, ?, ?)').bind(
    result.id,
    'Home',
    'home',
    1
  ).run()

  return c.json({ project: result })
})

// Get single project
projects.get('/:id', async (c) => {
  const userId = c.get('userId')
  const projectId = c.req.param('id')

  const project = await c.env.DB.prepare('SELECT * FROM projects WHERE id = ? AND user_id = ?').bind(projectId, userId).first()

  if (!project) return c.json({ error: 'Not found' }, 404)

  return c.json({ project })
})

// Get project pages
projects.get('/:id/pages', async (c) => {
  const projectId = c.req.param('id')
  const result = await c.env.DB.prepare('SELECT * FROM pages WHERE project_id = ? ORDER BY order_index').bind(projectId).all()
  return c.json({ pages: result.results })
})

// Create page
projects.post('/:id/pages', async (c) => {
  const projectId = c.req.param('id')
  const { title, slug } = await c.req.json()

  const result = await c.env.DB.prepare('INSERT INTO pages (project_id, title, slug) VALUES (?, ?, ?) RETURNING *').bind(
    projectId,
    title,
    slug
  ).first()

  return c.json({ page: result })
})

// Get page components
projects.get('/pages/:pageId/components', async (c) => {
  const pageId = c.req.param('pageId')
  const page = await c.env.DB.prepare('SELECT layout_json FROM pages WHERE id = ?').bind(pageId).first()
  
  const components = page?.layout_json ? JSON.parse(page.layout_json) : []
  
  return c.json({ components })
})

// Update page layout (add before export)
projects.put('/pages/:pageId', async (c) => {
  const pageId = c.req.param('pageId')
  const { layout_json } = await c.req.json()

  await c.env.DB.prepare('UPDATE pages SET layout_json = ? WHERE id = ?').bind(layout_json, pageId).run()

  return c.json({ success: true })
})
// Delete project
projects.delete('/:id', async (c) => {
  const userId = c.get('userId')
  const projectId = c.req.param('id')

  const project = await c.env.DB.prepare('SELECT * FROM projects WHERE id = ? AND user_id = ?').bind(projectId, userId).first()

  if (!project) return c.json({ error: 'Not found' }, 404)

  // Delete pages first (foreign key constraint)
  await c.env.DB.prepare('DELETE FROM pages WHERE project_id = ?').bind(projectId).run()
  
  // Delete deployments
  await c.env.DB.prepare('DELETE FROM deployments WHERE project_id = ?').bind(projectId).run()
  
  // Delete project
  await c.env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(projectId).run()

  return c.json({ success: true })
})
// Delete page
projects.delete('/pages/:pageId', async (c) => {
  const pageId = c.req.param('pageId')
  await c.env.DB.prepare('DELETE FROM pages WHERE id = ?').bind(pageId).run()
  return c.json({ success: true })
})
export default projects