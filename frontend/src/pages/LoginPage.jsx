import { useState, useContext } from 'react'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import axios from '../services/api'

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

          

          <p className="text-center text-muted mt-4">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  )
}