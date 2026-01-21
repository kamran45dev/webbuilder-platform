import { Button, Container, Row, Col, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-vh-100">
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={6} className="text-center text-lg-start mb-4 mb-lg-0">
              <h1 className="display-3 fw-bold mb-4">
                Build & Deploy Websites in Minutes
              </h1>
              <p className="lead mb-4">
                Create stunning, professional websites with our drag-and-drop builder. 
                No coding required. Pay only for what you build.
              </p>
              <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                <Button 
                  variant="light" 
                  size="lg" 
                  onClick={() => navigate('/register')}
                >
                  Get Started Free
                </Button>
                <Button 
                  variant="outline-light" 
                  size="lg"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <div className="text-center">
                <img 
                  src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&h=500&fit=crop" 
                  alt="Website Builder Preview" 
                  className="img-fluid rounded shadow-lg"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5 display-5 fw-bold">Why Choose Us?</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="display-1 mb-3">🎨</div>
                  <h4>Drag & Drop Builder</h4>
                  <p className="text-muted">
                    Build beautiful pages with our intuitive visual editor. No coding skills needed.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="display-1 mb-3">⚡</div>
                  <h4>Instant Deploy</h4>
                  <p className="text-muted">
                    Deploy your website to the cloud with one click. Live in seconds, not hours.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="display-1 mb-3">💰</div>
                  <h4>Pay Per Build</h4>
                  <p className="text-muted">
                    No monthly subscriptions. Only pay for the websites you build and deploy.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5 display-5 fw-bold">How It Works</h2>
          <Row className="align-items-center mb-5">
            <Col md={6} className="mb-4 mb-md-0">
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop" 
                alt="Choose Template" 
                className="img-fluid rounded shadow"
              />
            </Col>
            <Col md={6}>
              <h3 className="mb-3">1. Choose Your Template</h3>
              <p className="lead text-muted">
                Start with pre-designed components like Hero sections, Navbars, Features, and more.
              </p>
            </Col>
          </Row>

          <Row className="align-items-center mb-5 flex-md-row-reverse">
            <Col md={6} className="mb-4 mb-md-0">
              <img 
                src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop" 
                alt="Customize Design" 
                className="img-fluid rounded shadow"
              />
            </Col>
            <Col md={6}>
              <h3 className="mb-3">2. Customize Everything</h3>
              <p className="lead text-muted">
                Edit text, colors, images, and layout with our easy-to-use visual editor.
              </p>
            </Col>
          </Row>

          <Row className="align-items-center">
            <Col md={6} className="mb-4 mb-md-0">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop" 
                alt="Deploy Website" 
                className="img-fluid rounded shadow"
              />
            </Col>
            <Col md={6}>
              <h3 className="mb-3">3. Deploy & Go Live</h3>
              <p className="lead text-muted">
                Click publish and your website is live on Cloudflare's global network. Fast and reliable.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-dark text-white py-5">
        <Container className="text-center">
          <h2 className="display-4 fw-bold mb-4">Ready to Build Your Website?</h2>
          <p className="lead mb-4">Join thousands of creators building with our platform</p>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => navigate('/register')}
          >
            Start Building Now - It's Free!
          </Button>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-light py-4">
        <Container>
          <Row>
            <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
              <p className="mb-0 text-muted">© 2024 WebBuilder. All rights reserved.</p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <a href="#" className="text-muted text-decoration-none me-3">Privacy</a>
              <a href="#" className="text-muted text-decoration-none me-3">Terms</a>
              <a href="#" className="text-muted text-decoration-none">Contact</a>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  )
}