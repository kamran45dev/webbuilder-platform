import { useState, useContext } from 'react'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axios.post('/api/auth/login', formData)
      login(res.data.token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      const errData = err.response?.data
      if (errData?.needsVerification) {
        setNeedsVerification(true)
        setError('Please verify your email first')
      } else {
        setError(errData?.error || 'Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google'
  }

  const goToVerification = () => {
    navigate('/register') // Will show verification step
  }

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '450px' }}>
        <Card.Body className="p-5">
          <h2 className="text-center mb-4">Welcome Back</h2>
          <p className="text-center text-muted mb-4">Sign in to continue building</p>

          {error && (
            <Alert variant="danger">
              {error}
              {needsVerification && (
                <div className="mt-2">
                  <Button variant="link" size="sm" className="p-0" onClick={goToVerification}>
                    Go to verification
                  </Button>
                </div>
              )}
            </Alert>
          )}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Form>

          <div className="position-relative my-4">
            <hr />
            <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted">
              OR
            </span>
          </div>

          <Button variant="outline-dark" className="w-100 mb-3" onClick={handleGoogleLogin}>
            <svg className="me-2" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-muted mt-4">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  )
}