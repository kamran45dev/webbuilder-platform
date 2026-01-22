import React from 'react'
import { Button, Accordion } from 'react-bootstrap'
import { COMPONENT_TYPES } from './ComponentLibrary'

function ComponentRenderer({ component, isSelected, onClick }) {
  const { type, props } = component

  const containerClass = `mb-3 position-relative ${isSelected ? 'border border-primary border-3' : 'border border-secondary'} p-3 rounded component-container`

  const renderContent = () => {
    switch (type) {
      case COMPONENT_TYPES.HERO:
        return (
          <div className={`text-${props.textAlign} py-5 bg-${props.bgColor} text-white`}>
            <h1>{props.title}</h1>
            <p className="lead">{props.subtitle}</p>
            <button className="btn btn-light btn-lg">{props.buttonText}</button>
          </div>
        )

      case COMPONENT_TYPES.NAVBAR:
        return (
          <nav className={`navbar navbar-expand-lg navbar-${props.textColor} bg-${props.bgColor}`}>
            <div className="container-fluid">
              <span className="navbar-brand">{props.brandName}</span>
              <div className="navbar-nav">
                {props.links.map((link) => (
                  <a key={link.url || link.text} className="nav-link" href={link.url}>{link.text}</a>
                ))}
              </div>
            </div>
          </nav>
        )

      case COMPONENT_TYPES.FEATURES:
        return (
          <div className="py-5">
            <h2 className="text-center mb-4">{props.title}</h2>
            <div className="row">
              {props.items.map((item) => (
                <div key={item.id || item.title} className="col-md-4 text-center mb-3">
                  <div className="display-4">{item.icon}</div>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case COMPONENT_TYPES.CTA:
        return (
          <div className={`text-center py-5 bg-${props.bgColor} text-white`}>
            <h2>{props.title}</h2>
            {props.subtitle && <p className="lead">{props.subtitle}</p>}
            <button className="btn btn-light btn-lg mt-3">{props.buttonText}</button>
          </div>
        )

      case COMPONENT_TYPES.FOOTER:
        return (
          <footer className={`bg-${props.bgColor} text-white text-center py-3`}>
            <p className="mb-2">{props.text}</p>
            <div>
              {props.links.map((link) => (
                <a key={link.url || link.text} href={link.url} className="text-white me-3">{link.text}</a>
              ))}
            </div>
          </footer>
        )

      case COMPONENT_TYPES.TEXT:
        const textSizeClass = props.size === 'large' ? 'h2' : props.size === 'small' ? 'small' : ''
        return (
          <div className={`text-${props.align} ${textSizeClass}`}>
            <p>{props.content}</p>
          </div>
        )

      case COMPONENT_TYPES.IMAGE:
        return (
          <div className={`text-${props.align}`}>
            <img src={props.src} alt={props.alt} style={{ width: props.width }} className="img-fluid" />
          </div>
        )

      case COMPONENT_TYPES.CONTACT_FORM:
        return (
          <div className="py-5">
            <div className="container" style={{ maxWidth: '600px' }}>
              <h2 className="text-center mb-3">{props.title}</h2>
              <p className="text-center text-muted mb-4">{props.subtitle}</p>
              <form>
                {props.fields.map((field, idx) => (
                  <div key={field.id || field.label || idx} className="mb-3">
                    <label className="form-label">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea className="form-control" placeholder={field.placeholder} rows="4" required={field.required}></textarea>
                    ) : (
                      <input type={field.type} className="form-control" placeholder={field.placeholder} required={field.required} />
                    )}
                  </div>
                ))}
                <button type="submit" className="btn btn-primary w-100">{props.buttonText}</button>
              </form>
            </div>
          </div>
        )

      case COMPONENT_TYPES.TESTIMONIALS:
        return (
          <div className="py-5 bg-light">
            <h2 className="text-center mb-5">{props.title}</h2>
            <div className="row">
              {props.items.map((item) => (
                <div key={item.id || item.name} className="col-md-4 mb-3">
                  <div className="card h-100">
                    <div className="card-body text-center">
                      <div className="display-1 mb-3">{item.avatar}</div>
                      <p className="card-text">"{item.text}"</p>
                      <h6 className="card-title mb-0">{item.name}</h6>
                      <small className="text-muted">{item.role}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case COMPONENT_TYPES.PRICING:
        return (
          <div className="py-5">
            <h2 className="text-center mb-5">{props.title}</h2>
            <div className="row justify-content-center">
              {props.plans.map((plan) => (
                <div key={plan.id || plan.name} className="col-md-4 mb-3">
                  <div className={`card h-100 ${plan.highlighted ? 'border-primary shadow' : ''}`}>
                    <div className="card-body text-center">
                      {plan.highlighted && <span className="badge bg-primary mb-2">Popular</span>}
                      <h4 className="card-title">{plan.name}</h4>
                      <h2 className="my-3">
                        {plan.price}
                        <small className="text-muted">{plan.period}</small>
                      </h2>
                      <ul className="list-unstyled">
                        {plan.features.map((feature, fi) => (
                          <li key={feature || fi} className="mb-2">✓ {feature}</li>
                        ))}
                      </ul>
                      <button className={`btn ${plan.highlighted ? 'btn-primary' : 'btn-outline-primary'} w-100 mt-3`}>
                        Choose Plan
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case COMPONENT_TYPES.GALLERY:
        return (
          <div className="py-5">
            <h2 className="text-center mb-4">{props.title}</h2>
            <div className="row">
              {props.images.map((img, idx) => (
                <div key={img.id || img.src || idx} className={`col-md-${12 / props.columns} mb-3`}>
                  <img src={img.src} alt={img.alt} className="img-fluid rounded" />
                </div>
              ))}
            </div>
          </div>
        )

      case COMPONENT_TYPES.VIDEO:
        const paddingBottom = props.aspectRatio === '16:9' ? '56.25%' : '75%'
        return (
          <div className="py-5">
            <h2 className="text-center mb-4">{props.title}</h2>
            <div className="container" style={{ maxWidth: '800px' }}>
              <div style={{ position: 'relative', paddingBottom, height: 0, overflow: 'hidden' }}>
                <iframe
                  src={props.videoUrl}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )

      case COMPONENT_TYPES.FAQ:
        return (
          <div className="py-5">
            <h2 className="text-center mb-4">{props.title}</h2>
            <div className="container" style={{ maxWidth: '800px' }}>
              <Accordion>
                {props.items.map((item, idx) => (
                  <Accordion.Item key={item.id || item.question || idx} eventKey={idx.toString()}>
                    <Accordion.Header>{item.question}</Accordion.Header>
                    <Accordion.Body>{item.answer}</Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          </div>
        )

      case COMPONENT_TYPES.CARDS:
        return (
          <div className="py-5">
            <h2 className="text-center mb-5">{props.title}</h2>
            <div className="row">
              {props.items.map((item, idx) => (
                <div key={item.id || item.title || idx} className={`col-md-${12 / props.columns} mb-3`}>
                  <div className="card h-100 text-center">
                    <div className="card-body">
                      <div className="display-3 mb-3">{item.icon}</div>
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case COMPONENT_TYPES.TEAM:
        return (
          <div className="py-5 bg-light">
            <h2 className="text-center mb-5">{props.title}</h2>
            <div className="row justify-content-center">
              {props.members.map((member, idx) => (
                <div key={member.id || member.name || idx} className="col-md-4 mb-4">
                  <div className="card text-center h-100">
                    <img src={member.image} alt={member.name} className="card-img-top rounded-circle mx-auto mt-3" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
                    <div className="card-body">
                      <h5 className="card-title">{member.name}</h5>
                      <p className="text-muted">{member.role}</p>
                      <p className="card-text small">{member.bio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return <div>Unknown component</div>
    }
  }

  return (
    <div 
      className={containerClass}
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      <Button 
        variant="primary" 
        size="sm" 
        className="edit-button"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          onClick()
        }}
      >
        ✏️ Edit
      </Button>
      <div>
        {renderContent()}
      </div>
    </div>
  )
}

// Memoize with shallow reference comparison
export default React.memo(ComponentRenderer, (prevProps, nextProps) => {
  return prevProps.component.id === nextProps.component.id &&
         prevProps.isSelected === nextProps.isSelected &&
         prevProps.component.props === nextProps.component.props
})
