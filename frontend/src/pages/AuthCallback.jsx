import { useEffect, useContext } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { Spinner } from 'react-bootstrap'

export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (token) {
      // Store token and redirect to dashboard
      login(token, {}) // We'll fetch user data from /auth/me via AuthContext
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }, [searchParams, login, navigate])

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Spinner animation="border" />
    </div>
  )
}