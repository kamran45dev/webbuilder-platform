import { Hono } from 'hono'
import jwt from '@tsndr/cloudflare-worker-jwt'
import { hashPassword, verifyPassword, generateOTP } from '../utils/password.js'
import { sendOTPEmail } from '../services/email.js'

const auth = new Hono()

// ===== EMAIL/PASSWORD AUTH =====

// Register with email/password
auth.post('/register', async (c) => {
  try {
    const { email, password, name } = await c.req.json()

    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400)
    }

    // Check if user exists
    const existingUser = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first()
    
    if (existingUser) {
      return c.json({ error: 'Email already registered' }, 400)
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Generate OTP
    const otp = generateOTP()
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    // Create user
    await c.env.DB.prepare(
      'INSERT INTO users (email, name, password_hash, otp_code, otp_expires_at, email_verified, auth_provider) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(email, name || email.split('@')[0], passwordHash, otp, otpExpiresAt, 0, 'email').run()

    // Send OTP email (HARDCODED KEY FOR TESTING)
    try {
      await sendOTPEmail(email, otp, c.env.BREVO_API_KEY)
    } catch (err) {
      console.error('Email send failed:', err)
      return c.json({ error: 'Failed to send verification email' }, 500)
    }

    return c.json({ 
      message: 'Registration successful. Check your email for verification code.',
      email 
    })
  } catch (err) {
    console.error('Registration error:', err)
    return c.json({ error: err.message || 'Registration failed' }, 500)
  }
})

// Verify OTP
auth.post('/verify-otp', async (c) => {
  const { email, otp } = await c.req.json()

  const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first()

  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  if (user.email_verified === 1) {
    return c.json({ error: 'Email already verified' }, 400)
  }

  // Check OTP
  if (user.otp_code !== otp) {
    return c.json({ error: 'Invalid OTP' }, 400)
  }

  // Check expiry
  if (new Date(user.otp_expires_at) < new Date()) {
    return c.json({ error: 'OTP expired' }, 400)
  }

  // Mark as verified
  await c.env.DB.prepare('UPDATE users SET email_verified = 1, otp_code = NULL, otp_expires_at = NULL WHERE id = ?').bind(user.id).run()

  // Generate JWT
  const token = await jwt.sign({ userId: user.id }, c.env.JWT_SECRET)

  return c.json({ 
    message: 'Email verified successfully',
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  })
})

// Resend OTP
auth.post('/resend-otp', async (c) => {
  const { email } = await c.req.json()

  const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first()

  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  if (user.email_verified === 1) {
    return c.json({ error: 'Email already verified' }, 400)
  }

  // Generate new OTP
  const otp = generateOTP()
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

  await c.env.DB.prepare('UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE id = ?').bind(otp, otpExpiresAt, user.id).run()

  // Send OTP (HARDCODED KEY FOR TESTING)
  try {
    await sendOTPEmail(email, otp, c.env.BREVO_API_KEY)
  } catch (err) {
    return c.json({ error: 'Failed to send email' }, 500)
  }

  return c.json({ message: 'OTP resent successfully' })
})

// Login with email/password
auth.post('/login', async (c) => {
  const { email, password } = await c.req.json()

  const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ? AND auth_provider = ?').bind(email, 'email').first()

  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  // Verify password
  const isValid = await verifyPassword(password, user.password_hash)

  if (!isValid) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  // Check if email verified
  if (user.email_verified === 0) {
    return c.json({ error: 'Email not verified', needsVerification: true, email: user.email }, 403)
  }

  // Generate JWT
  const token = await jwt.sign({ userId: user.id }, c.env.JWT_SECRET)

  return c.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar
    }
  })
})

// ===== GOOGLE OAUTH =====

// Google OAuth login
auth.get('/google', async (c) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${c.env.GOOGLE_CLIENT_ID}&redirect_uri=${c.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=openid email profile`
  return c.redirect(googleAuthUrl)
})

// Google OAuth callback
auth.get('/google/callback', async (c) => {
  try {
    const code = c.req.query('code')
    
    // Exchange code for token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: c.env.GOOGLE_CLIENT_ID,
        client_secret: c.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: c.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    })
    const tokenData = await tokenRes.json()

    // Get user info
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    })
    const userData = await userRes.json()

    // Check if user exists
    let user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(userData.email).first()

    if (!user) {
      // Create user with Google OAuth
      await c.env.DB.prepare('INSERT INTO users (email, name, avatar, email_verified, auth_provider) VALUES (?, ?, ?, ?, ?)').bind(
        userData.email,
        userData.name,
        userData.picture,
        1,
        'google'
      ).run()

      user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(userData.email).first()
    }

    // Generate JWT
    const token = await jwt.sign({ userId: user.id }, c.env.JWT_SECRET)

    // Redirect to frontend with token
    return c.redirect(`${c.env.FRONTEND_URL}/auth/callback?token=${token}`)
  } catch (err) {
    console.error('Google OAuth error:', err)
    return c.json({ error: err.message }, 500)
  }
})

// Get current user
auth.get('/me', async (c) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader) return c.json({ error: 'Unauthorized' }, 401)

  const token = authHeader.replace('Bearer ', '')
  
  try {
    const isValid = await jwt.verify(token, c.env.JWT_SECRET)
    
    if (!isValid) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    const { payload } = jwt.decode(token)
    const user = await c.env.DB.prepare('SELECT id, email, name, avatar FROM users WHERE id = ?').bind(payload.userId).first()
    
    if (!user) return c.json({ error: 'User not found' }, 404)
    
    return c.json({ user })
  } catch (err) {
    return c.json({ error: 'Invalid token' }, 401)
  }
})

export default auth