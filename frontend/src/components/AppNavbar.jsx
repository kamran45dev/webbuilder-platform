import { useContext } from 'react'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function AppNavbar() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (location.pathname === '/' || location.pathname === '/login' || !user) {
    return null
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="mb-0">
      <Container fluid>
        <Navbar.Brand as={Link} to="/dashboard">
          🌐 WebBuilder
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="main-navbar" />
        
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/templates">
              Templates
            </Nav.Link>
          </Nav>
          
          <Nav className="ms-auto align-items-center">
            <Navbar.Text className="me-3 text-light">
              {user.email}
            </Navbar.Text>
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}