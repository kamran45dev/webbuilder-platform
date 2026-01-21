export function generateReactApp(project, pages) {
  console.log('=== CODE GENERATION START ===')
  console.log('Project:', project.name)
  console.log('Pages:', pages.map(p => p.title).join(', '))
  
  const files = {}

  // Package.json
  files['package.json'] = JSON.stringify({
    name: project.name.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    private: true,
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      'react-router-dom': '^6.22.0',
      bootstrap: '^5.3.3',
      'react-bootstrap': '^2.10.0'
    },
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview'
    },
    devDependencies: {
      '@vitejs/plugin-react': '^4.2.1',
      vite: '^5.1.4'
    }
  }, null, 2)

  // Vite config
  files['vite.config.js'] = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`

  // Index.html
  files['index.html'] = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${project.name}" />
    <title>${project.name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`

  // Styles CSS - ADD THIS BEFORE main.jsx
  files['src/styles.css'] = `/* Global Responsive Styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Ensure images are responsive */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Responsive typography */
h1 {
  font-size: 2rem;
}

h2 {
  font-size: 1.75rem;
}

h3 {
  font-size: 1.5rem;
}

.display-4 {
  font-size: 2.5rem;
}

@media (min-width: 768px) {
  h1 { font-size: 3rem; }
  h2 { font-size: 2.5rem; }
  h3 { font-size: 2rem; }
  .display-4 { font-size: 3.5rem; }
}

/* Responsive spacing */
.py-5 {
  padding-top: 2rem !important;
  padding-bottom: 2rem !important;
}

@media (min-width: 768px) {
  .py-5 {
    padding-top: 3rem !important;
    padding-bottom: 3rem !important;
  }
}

/* Mobile-friendly buttons */
.btn {
  min-height: 44px;
  min-width: 44px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  touch-action: manipulation;
}

@media (max-width: 767px) {
  .btn-lg {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}

/* Card responsiveness */
.card {
  margin-bottom: 1rem;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

/* Form inputs - prevent zoom on iOS */
input, textarea, select {
  font-size: 16px !important;
}

.form-control {
  font-size: 16px !important;
}

/* Navbar mobile improvements */
.navbar-toggler {
  border: none;
  padding: 0.5rem;
}

.navbar-toggler:focus {
  box-shadow: none;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Container padding on mobile */
@media (max-width: 767px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Accessibility improvements */
a:focus, button:focus {
  outline: 2px solid #0d6efd;
  outline-offset: 2px;
}

/* Loading states */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.3s ease-in;
}`

  // Main.jsx
  files['src/main.jsx'] = `import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`

  // App.jsx with routes
  const routes = pages.map(page => {
    const path = page.is_home ? '/' : `/${page.slug}`
    const componentName = page.slug.charAt(0).toUpperCase() + page.slug.slice(1).replace(/-/g, '')
    return { path, componentName, page }
  })

  files['src/App.jsx'] = `import { BrowserRouter, Routes, Route } from 'react-router-dom'
${routes.map(r => `import ${r.componentName} from './pages/${r.componentName}'`).join('\n')}

function App() {
  return (
    <BrowserRouter>
      <Routes>
${routes.map(r => `        <Route path="${r.path}" element={<${r.componentName} />} />`).join('\n')}
        <Route path="*" element={<${routes[0].componentName} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App`

  // Generate page components
  for (const route of routes) {
    files[`src/pages/${route.componentName}.jsx`] = generatePageComponent(route.page)
  }

  // Component renderer utilities
  files['src/components/ComponentRenderer.jsx'] = generateComponentRenderer()

  // Log what we're generating
  console.log('=== FILES TO DEPLOY ===')
  Object.keys(files).forEach(path => {
    console.log(`  ${path} (${files[path].length} chars)`)
  })
  console.log('=======================')

  return files
}

function generatePageComponent(page) {
  const layout = page.layout_json ? JSON.parse(page.layout_json) : []
  
  console.log(`Page "${page.title}" has ${layout.length} components`)
  
  return `import ComponentRenderer from '../components/ComponentRenderer'

const components = ${JSON.stringify(layout, null, 2)}

export default function ${page.slug.charAt(0).toUpperCase() + page.slug.slice(1).replace(/-/g, '')}() {
  return (
    <div className="page-wrapper">
      {components.map((component, index) => (
        <ComponentRenderer key={index} component={component} />
      ))}
    </div>
  )
}`
}

function generateComponentRenderer() {
  return `import { Accordion, Navbar, Nav, Container } from 'react-bootstrap'

export default function ComponentRenderer({ component }) {
  const { type, props = {} } = component

  switch (type) {
    case 'hero':
      return (
        <section className={\`hero py-5 text-\${props.textAlign || 'center'} bg-\${props.bgColor || 'primary'} text-white\`}>
          <Container>
            <h1 className="display-4 fw-bold mb-3">{props.title}</h1>
            <p className="lead mb-4">{props.subtitle}</p>
            {props.buttonText && (
              <a href={props.buttonLink || '#'} className="btn btn-light btn-lg">
                {props.buttonText}
              </a>
            )}
          </Container>
        </section>
      )

    case 'navbar':
      return (
        <Navbar 
          bg={props.bgColor || 'light'} 
          variant={props.textColor || 'light'} 
          expand="lg" 
          className="shadow-sm sticky-top"
        >
          <Container fluid>
            <Navbar.Brand href="/" className="fw-bold">
              {props.brandName}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="main-navbar" />
            <Navbar.Collapse id="main-navbar">
              <Nav className="ms-auto">
                {(props.links || []).map((link, i) => (
                  <Nav.Link key={i} href={link.url} className="px-3">
                    {link.text}
                  </Nav.Link>
                ))}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )

    case 'features':
      return (
        <section className="features py-5">
          <Container>
            <h2 className="text-center mb-5">{props.title}</h2>
            <div className="row g-4">
              {(props.items || []).map((item, i) => (
                <div key={i} className="col-12 col-sm-6 col-lg-4">
                  <div className="text-center h-100 p-3">
                    <div className="display-4 mb-3">{item.icon}</div>
                    <h4 className="mb-3">{item.title}</h4>
                    <p className="text-muted">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )

    case 'cta':
      return (
        <section className={\`cta text-center py-5 bg-\${props.bgColor || 'primary'} text-white\`}>
          <Container>
            <h2 className="mb-3">{props.title}</h2>
            {props.subtitle && <p className="lead mb-4">{props.subtitle}</p>}
            {props.buttonText && (
              <a href={props.buttonLink || '#'} className="btn btn-light btn-lg">
                {props.buttonText}
              </a>
            )}
          </Container>
        </section>
      )

    case 'footer':
      return (
        <footer className={\`bg-\${props.bgColor || 'dark'} text-white py-4 mt-auto\`}>
          <Container>
            <div className="row">
              <div className="col-12 text-center mb-3">
                <p className="mb-0">{props.text}</p>
              </div>
              {(props.links || []).length > 0 && (
                <div className="col-12 text-center">
                  {props.links.map((link, i) => (
                    <a key={i} href={link.url} className="text-white text-decoration-none mx-2">
                      {link.text}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </Container>
        </footer>
      )

    case 'text':
      const textSizeClass = props.size === 'large' ? 'fs-3' : props.size === 'small' ? 'fs-6' : 'fs-5'
      return (
        <section className="text-section py-3">
          <Container className={\`text-\${props.align || 'start'} \${textSizeClass}\`}>
            <p>{props.content}</p>
          </Container>
        </section>
      )

    case 'image':
      return (
        <section className="image-section py-3">
          <Container className={\`text-\${props.align || 'center'}\`}>
            <img 
              src={props.src} 
              alt={props.alt || ''} 
              className="img-fluid rounded shadow-sm" 
              style={{ maxWidth: props.width || '100%' }}
              loading="lazy"
            />
          </Container>
        </section>
      )

    case 'contact_form':
      return (
        <section className="contact-form py-5 bg-light">
          <Container style={{ maxWidth: '600px' }}>
            <h2 className="text-center mb-3">{props.title}</h2>
            {props.subtitle && <p className="text-center text-muted mb-4">{props.subtitle}</p>}
            <form>
              {(props.fields || []).map((field, i) => (
                <div key={i} className="mb-3">
                  <label className="form-label fw-bold">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea 
                      className="form-control" 
                      placeholder={field.placeholder} 
                      rows="4" 
                      required={field.required}
                    ></textarea>
                  ) : (
                    <input 
                      type={field.type} 
                      className="form-control" 
                      placeholder={field.placeholder} 
                      required={field.required} 
                    />
                  )}
                </div>
              ))}
              <button type="submit" className="btn btn-primary btn-lg w-100">
                {props.buttonText || 'Submit'}
              </button>
            </form>
          </Container>
        </section>
      )

    case 'testimonials':
      return (
        <section className="testimonials py-5 bg-light">
          <Container>
            <h2 className="text-center mb-5">{props.title}</h2>
            <div className="row g-4">
              {(props.items || []).map((item, i) => (
                <div key={i} className="col-12 col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body text-center p-4">
                      <div className="display-1 mb-3">{item.avatar}</div>
                      <p className="card-text fst-italic mb-3">"{item.text}"</p>
                      <h6 className="card-title mb-1 fw-bold">{item.name}</h6>
                      <small className="text-muted">{item.role}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )

    case 'pricing':
      return (
        <section className="pricing py-5">
          <Container>
            <h2 className="text-center mb-5">{props.title}</h2>
            <div className="row justify-content-center g-4">
              {(props.plans || []).map((plan, i) => (
                <div key={i} className="col-12 col-md-6 col-lg-4">
                  <div className={\`card h-100 shadow \${plan.highlighted ? 'border-primary border-3' : ''}\`}>
                    <div className="card-body text-center p-4">
                      {plan.highlighted && (
                        <span className="badge bg-primary mb-3 fs-6">Most Popular</span>
                      )}
                      <h4 className="card-title mb-3">{plan.name}</h4>
                      <h2 className="display-4 my-4">
                        {plan.price}
                        <small className="fs-6 text-muted d-block mt-2">{plan.period}</small>
                      </h2>
                      <ul className="list-unstyled text-start mb-4">
                        {(plan.features || []).map((feature, fi) => (
                          <li key={fi} className="mb-3">
                            <span className="text-success me-2">✓</span> {feature}
                          </li>
                        ))}
                      </ul>
                      <button className={\`btn \${plan.highlighted ? 'btn-primary' : 'btn-outline-primary'} btn-lg w-100\`}>
                        Choose Plan
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )

    case 'gallery':
      return (
        <section className="gallery py-5">
          <Container>
            <h2 className="text-center mb-5">{props.title}</h2>
            <div className="row g-3">
              {(props.images || []).map((img, i) => (
                <div key={i} className={\`col-12 col-sm-6 col-md-\${12 / (props.columns || 3)}\`}>
                  <img 
                    src={img.src} 
                    alt={img.alt || ''} 
                    className="img-fluid rounded shadow-sm w-100" 
                    loading="lazy"
                    style={{ objectFit: 'cover', aspectRatio: '16/9' }}
                  />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )

    case 'video':
      return (
        <section className="video py-5">
          <Container>
            <h2 className="text-center mb-5">{props.title}</h2>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <div className="ratio ratio-16x9 shadow rounded overflow-hidden">
                <iframe
                  src={props.videoUrl}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={props.title}
                ></iframe>
              </div>
            </div>
          </Container>
        </section>
      )

    case 'faq':
      return (
        <section className="faq py-5">
          <Container>
            <h2 className="text-center mb-5">{props.title}</h2>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <Accordion>
                {(props.items || []).map((item, i) => (
                  <Accordion.Item key={i} eventKey={i.toString()}>
                    <Accordion.Header>{item.question}</Accordion.Header>
                    <Accordion.Body className="text-muted">
                      {item.answer}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          </Container>
        </section>
      )

    case 'cards':
      return (
        <section className="cards py-5">
          <Container>
            <h2 className="text-center mb-5">{props.title}</h2>
            <div className="row g-4">
              {(props.items || []).map((item, i) => (
                <div key={i} className={\`col-12 col-sm-6 col-lg-\${12 / (props.columns || 3)}\`}>
                  <div className="card h-100 shadow-sm">
                    <div className="card-body text-center p-4">
                      <div className="display-3 mb-4">{item.icon}</div>
                      <h5 className="card-title mb-3">{item.title}</h5>
                      <p className="card-text text-muted">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )

    case 'team':
      return (
        <section className="team py-5 bg-light">
          <Container>
            <h2 className="text-center mb-5">{props.title}</h2>
            <div className="row justify-content-center g-4">
              {(props.members || []).map((member, i) => (
                <div key={i} className="col-12 col-sm-6 col-lg-4">
                  <div className="card text-center h-100 shadow-sm">
                    <div className="card-body p-4">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="rounded-circle mx-auto mb-3 shadow" 
                        style={{ width: '120px', height: '120px', objectFit: 'cover' }} 
                        loading="lazy"
                      />
                      <h5 className="card-title mb-2">{member.name}</h5>
                      <p className="text-primary fw-bold mb-3">{member.role}</p>
                      <p className="card-text text-muted small">{member.bio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )

    default:
      return (
        <div className="alert alert-warning m-3" role="alert">
          <strong>Unknown component:</strong> {type}
        </div>
      )
  }
}`
}