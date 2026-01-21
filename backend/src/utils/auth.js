import jwt from '@tsndr/cloudflare-worker-jwt'

export async function authMiddleware(c, next) {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    const isValid = await jwt.verify(token, c.env.JWT_SECRET)
    
    if (!isValid) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    const { payload } = jwt.decode(token)
    c.set('userId', payload.userId)
    await next()
  } catch (err) {
    return c.json({ error: 'Invalid token' }, 401)
  }
}