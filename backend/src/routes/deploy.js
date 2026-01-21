import { Hono } from 'hono'
import { authMiddleware } from '../utils/auth.js'
import { generateReactApp } from '../services/codeGenerator.js'
import { deployToVercel } from '../services/vercelService.js'

const deploy = new Hono()

deploy.use('/*', authMiddleware)

// Preview deploy
deploy.post('/projects/:id/deploy/preview', async (c) => {
  const projectId = c.req.param('id')
  const userId = c.get('userId')

  try {
    console.log('=== PREVIEW DEPLOYMENT STARTED ===')
    
    const project = await c.env.DB.prepare('SELECT * FROM projects WHERE id = ? AND user_id = ?').bind(projectId, userId).first()
    if (!project) return c.json({ error: 'Not found' }, 404)

    const pagesResult = await c.env.DB.prepare('SELECT * FROM pages WHERE project_id = ? ORDER BY order_index').bind(projectId).all()
    const pages = pagesResult.results

    console.log('=== DATABASE PAGES ===')
    pages.forEach(p => {
      console.log(`Page: ${p.title}`)
      console.log(`  layout_json length: ${p.layout_json ? p.layout_json.length : 0}`)
      console.log(`  layout_json preview: ${p.layout_json ? p.layout_json.substring(0, 100) : 'NULL'}`)
    })
    console.log('=====================')

    if (pages.length === 0) {
      return c.json({ error: 'No pages to deploy' }, 400)
    }

    console.log('Generating React app...')
    const files = generateReactApp(project, pages)

    const projectName = `${project.name.toLowerCase().replace(/\s+/g, '-')}-${projectId}-preview`
    
    console.log('Deploying to Vercel...')
    const deployment = await deployToVercel(
      c.env.VERCEL_API_TOKEN,
      projectName,
      files
    )

    console.log('Deployment created:', deployment.url)

    await c.env.DB.prepare(
      'INSERT INTO deployments (project_id, branch, status, url, commit_hash) VALUES (?, ?, ?, ?, ?)'
    ).bind(projectId, 'preview', deployment.status, deployment.url, deployment.id).run()

    return c.json({ 
      url: deployment.url, 
      status: deployment.status,
      message: 'Preview deployment successful! Your site is being built.',
      deploymentId: deployment.id
    })
  } catch (error) {
    console.error('Preview deploy error:', error)
    return c.json({ error: error.message || 'Deployment failed' }, 500)
  }
})

// Production deploy
deploy.post('/projects/:id/deploy/production', async (c) => {
  const projectId = c.req.param('id')
  const userId = c.get('userId')

  try {
    console.log('=== PRODUCTION DEPLOYMENT STARTED ===')
    
    const project = await c.env.DB.prepare('SELECT * FROM projects WHERE id = ? AND user_id = ?').bind(projectId, userId).first()
    if (!project) return c.json({ error: 'Not found' }, 404)

    const pagesResult = await c.env.DB.prepare('SELECT * FROM pages WHERE project_id = ? ORDER BY order_index').bind(projectId).all()
    const pages = pagesResult.results

    console.log('=== DATABASE PAGES ===')
    pages.forEach(p => {
      console.log(`Page: ${p.title}`)
      console.log(`  layout_json length: ${p.layout_json ? p.layout_json.length : 0}`)
      console.log(`  layout_json preview: ${p.layout_json ? p.layout_json.substring(0, 100) : 'NULL'}`)
    })
    console.log('=====================')

    if (pages.length === 0) {
      return c.json({ error: 'No pages to deploy' }, 400)
    }

    console.log('Generating React app for', pages.length, 'pages')
    const files = generateReactApp(project, pages)
    console.log('Generated', Object.keys(files).length, 'files')

    const projectName = `${project.name.toLowerCase().replace(/\s+/g, '-')}-${projectId}`
    
    console.log('Deploying to Vercel as:', projectName)
    const deployment = await deployToVercel(
      c.env.VERCEL_API_TOKEN,
      projectName,
      files
    )

    console.log('Deployment created:', deployment.url)

    await c.env.DB.prepare(
      'INSERT INTO deployments (project_id, branch, status, url, commit_hash) VALUES (?, ?, ?, ?, ?)'
    ).bind(projectId, 'main', deployment.status, deployment.url, deployment.id).run()

    console.log('=== DEPLOYMENT SUCCESS ===')

    return c.json({ 
      url: deployment.url, 
      status: deployment.status,
      message: 'Production deployment successful!',
      deploymentId: deployment.id
    })
  } catch (error) {
    console.error('=== DEPLOYMENT FAILED ===')
    console.error('Error:', error.message)
    return c.json({ error: error.message || 'Deployment failed' }, 500)
  }
})

// Get deployment status
deploy.get('/deployments/:deploymentId/status', async (c) => {
  const deploymentId = c.req.param('deploymentId')

  try {
    const status = await getDeploymentStatus(c.env.VERCEL_API_TOKEN, deploymentId)
    return c.json(status)
  } catch (error) {
    return c.json({ error: 'Failed to get status' }, 500)
  }
})

// Get deployment history
deploy.get('/projects/:id/deployments', async (c) => {
  const projectId = c.req.param('id')
  const userId = c.get('userId')

  const project = await c.env.DB.prepare('SELECT * FROM projects WHERE id = ? AND user_id = ?').bind(projectId, userId).first()
  if (!project) return c.json({ error: 'Not found' }, 404)

  const deploymentsResult = await c.env.DB.prepare(
    'SELECT * FROM deployments WHERE project_id = ? ORDER BY created_at DESC LIMIT 10'
  ).bind(projectId).all()

  return c.json({ deployments: deploymentsResult.results })
})

export default deploy