import { useState, useEffect, useRef } from 'react'
import { Form, Button } from 'react-bootstrap'
import { COMPONENT_TYPES } from './ComponentLibrary'

function PropertiesPanel({ component, onUpdate }) {
  const [localProps, setLocalProps] = useState({})
  const updateTimeoutRef = useRef(null)
  const componentIdRef = useRef(null)

  // Update local state ONLY when component ID changes
  useEffect(() => {
    if (component && component.id !== componentIdRef.current) {
      componentIdRef.current = component.id
      setLocalProps(component.props || {})
    }
  }, [component?.id])

  if (!component) {
    return (
      <div className="p-3 text-muted">
        <p>Select a component to edit its properties</p>
      </div>
    )
  }

  const { type } = component

  const debouncedUpdate = (updatedProps) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }

    updateTimeoutRef.current = setTimeout(() => {
      onUpdate({
        ...component,
        props: updatedProps
      })
    }, 500) // Increased to 500ms
  }

  const handleChange = (key, value) => {
    const updatedProps = { ...localProps, [key]: value }
    setLocalProps(updatedProps)
    debouncedUpdate(updatedProps)
  }

  const handleArrayItemChange = (arrayKey, index, itemKey, value) => {
    const newArray = [...(localProps[arrayKey] || [])]
    newArray[index] = { ...newArray[index], [itemKey]: value }
    const updatedProps = { ...localProps, [arrayKey]: newArray }
    setLocalProps(updatedProps)
    debouncedUpdate(updatedProps)
  }

  const handleAddArrayItem = (arrayKey, defaultItem) => {
    const newArray = [...(localProps[arrayKey] || []), defaultItem]
    const updatedProps = { ...localProps, [arrayKey]: newArray }
    setLocalProps(updatedProps)
    onUpdate({
      ...component,
      props: updatedProps
    })
  }

  const handleRemoveArrayItem = (arrayKey, index) => {
    const newArray = (localProps[arrayKey] || []).filter((_, i) => i !== index)
    const updatedProps = { ...localProps, [arrayKey]: newArray }
    setLocalProps(updatedProps)
    onUpdate({
      ...component,
      props: updatedProps
    })
  }

  const renderFields = () => {
    switch (type) {
      case COMPONENT_TYPES.HERO:
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={localProps.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subtitle</Form.Label>
              <Form.Control
                value={localProps.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Button Text</Form.Label>
              <Form.Control
                value={localProps.buttonText || ''}
                onChange={(e) => handleChange('buttonText', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Button Link</Form.Label>
              <Form.Control
                value={localProps.buttonLink || ''}
                onChange={(e) => handleChange('buttonLink', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Background Color</Form.Label>
              <Form.Select
                value={localProps.bgColor || 'primary'}
                onChange={(e) => handleChange('bgColor', e.target.value)}
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="success">Success</option>
                <option value="danger">Danger</option>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Text Alignment</Form.Label>
              <Form.Select
                value={localProps.textAlign || 'center'}
                onChange={(e) => handleChange('textAlign', e.target.value)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </Form.Select>
            </Form.Group>
          </>
        )

      case COMPONENT_TYPES.NAVBAR:
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Brand Name</Form.Label>
              <Form.Control
                value={localProps.brandName || ''}
                onChange={(e) => handleChange('brandName', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Background Color</Form.Label>
              <Form.Select
                value={localProps.bgColor || 'light'}
                onChange={(e) => handleChange('bgColor', e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="primary">Primary</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Text Color</Form.Label>
              <Form.Select
                value={localProps.textColor || 'dark'}
                onChange={(e) => handleChange('textColor', e.target.value)}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </Form.Select>
            </Form.Group>
            <Form.Label>Navigation Links</Form.Label>
            {(localProps.links || []).map((link, i) => (
              <div key={i} className="border p-2 mb-2 rounded">
                <Form.Control
                  size="sm"
                  placeholder="Link Text"
                  value={link.text || ''}
                  onChange={(e) => handleArrayItemChange('links', i, 'text', e.target.value)}
                  className="mb-1"
                />
                <Form.Control
                  size="sm"
                  placeholder="URL"
                  value={link.url || ''}
                  onChange={(e) => handleArrayItemChange('links', i, 'url', e.target.value)}
                  className="mb-1"
                />
                <Button variant="danger" size="sm" onClick={() => handleRemoveArrayItem('links', i)}>Remove</Button>
              </div>
            ))}
            <Button size="sm" variant="outline-primary" onClick={() => handleAddArrayItem('links', { text: 'New Link', url: '#' })}>
              + Add Link
            </Button>
          </>
        )

      case COMPONENT_TYPES.FEATURES:
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={localProps.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </Form.Group>
            <Form.Label>Feature Items</Form.Label>
            {(localProps.items || []).map((item, i) => (
              <div key={i} className="border p-2 mb-2 rounded">
                <Form.Control
                  size="sm"
                  placeholder="Icon (emoji)"
                  value={item.icon || ''}
                  onChange={(e) => handleArrayItemChange('items', i, 'icon', e.target.value)}
                  className="mb-1"
                />
                <Form.Control
                  size="sm"
                  placeholder="Title"
                  value={item.title || ''}
                  onChange={(e) => handleArrayItemChange('items', i, 'title', e.target.value)}
                  className="mb-1"
                />
                <Form.Control
                  size="sm"
                  placeholder="Description"
                  value={item.description || ''}
                  onChange={(e) => handleArrayItemChange('items', i, 'description', e.target.value)}
                  className="mb-1"
                />
                <Button variant="danger" size="sm" onClick={() => handleRemoveArrayItem('items', i)}>Remove</Button>
              </div>
            ))}
            <Button size="sm" variant="outline-primary" onClick={() => handleAddArrayItem('items', { icon: '⭐', title: 'Feature', description: 'Description' })}>
              + Add Feature
            </Button>
          </>
        )

      case COMPONENT_TYPES.CTA:
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={localProps.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subtitle</Form.Label>
              <Form.Control
                value={localProps.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Button Text</Form.Label>
              <Form.Control
                value={localProps.buttonText || ''}
                onChange={(e) => handleChange('buttonText', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Background Color</Form.Label>
              <Form.Select
                value={localProps.bgColor || 'primary'}
                onChange={(e) => handleChange('bgColor', e.target.value)}
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="success">Success</option>
                <option value="dark">Dark</option>
              </Form.Select>
            </Form.Group>
          </>
        )

      case COMPONENT_TYPES.FOOTER:
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Footer Text</Form.Label>
              <Form.Control
                value={localProps.text || ''}
                onChange={(e) => handleChange('text', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Background Color</Form.Label>
              <Form.Select
                value={localProps.bgColor || 'dark'}
                onChange={(e) => handleChange('bgColor', e.target.value)}
              >
                <option value="dark">Dark</option>
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
              </Form.Select>
            </Form.Group>
            <Form.Label>Footer Links</Form.Label>
            {(localProps.links || []).map((link, i) => (
              <div key={i} className="border p-2 mb-2 rounded">
                <Form.Control
                  size="sm"
                  placeholder="Link Text"
                  value={link.text || ''}
                  onChange={(e) => handleArrayItemChange('links', i, 'text', e.target.value)}
                  className="mb-1"
                />
                <Form.Control
                  size="sm"
                  placeholder="URL"
                  value={link.url || ''}
                  onChange={(e) => handleArrayItemChange('links', i, 'url', e.target.value)}
                  className="mb-1"
                />
                <Button variant="danger" size="sm" onClick={() => handleRemoveArrayItem('links', i)}>Remove</Button>
              </div>
            ))}
            <Button size="sm" variant="outline-primary" onClick={() => handleAddArrayItem('links', { text: 'Link', url: '#' })}>
              + Add Link
            </Button>
          </>
        )

      case COMPONENT_TYPES.TEXT:
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={localProps.content || ''}
                onChange={(e) => handleChange('content', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Size</Form.Label>
              <Form.Select
                value={localProps.size || 'normal'}
                onChange={(e) => handleChange('size', e.target.value)}
              >
                <option value="small">Small</option>
                <option value="normal">Normal</option>
                <option value="large">Large</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Alignment</Form.Label>
              <Form.Select
                value={localProps.align || 'left'}
                onChange={(e) => handleChange('align', e.target.value)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </Form.Select>
            </Form.Group>
          </>
        )

      case COMPONENT_TYPES.IMAGE:
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                value={localProps.src || ''}
                onChange={(e) => handleChange('src', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Alt Text</Form.Label>
              <Form.Control
                value={localProps.alt || ''}
                onChange={(e) => handleChange('alt', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Width</Form.Label>
              <Form.Select
                value={localProps.width || '100%'}
                onChange={(e) => handleChange('width', e.target.value)}
              >
                <option value="100%">Full Width</option>
                <option value="75%">75%</option>
                <option value="50%">50%</option>
                <option value="25%">25%</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Alignment</Form.Label>
              <Form.Select
                value={localProps.align || 'center'}
                onChange={(e) => handleChange('align', e.target.value)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </Form.Select>
            </Form.Group>
          </>
        )

      case COMPONENT_TYPES.CONTACT_FORM:
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={localProps.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subtitle</Form.Label>
              <Form.Control
                value={localProps.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Button Text</Form.Label>
              <Form.Control
                value={localProps.buttonText || ''}
                onChange={(e) => handleChange('buttonText', e.target.value)}
              />
            </Form.Group>
          </>
        )

      case COMPONENT_TYPES.TESTIMONIALS:
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={localProps.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </Form.Group>
            <Form.Label>Testimonial Items</Form.Label>
            {(localProps.items || []).map((item, i) => (
              <div key={i} className="border p-2 mb-2 rounded">
                <Form.Control
                  size="sm"
                  placeholder="Name"
                  value={item.name || ''}
                  onChange={(e) => handleArrayItemChange('items', i, 'name', e.target.value)}
                  className="mb-1"
                />
                <Form.Control
                  size="sm"
                  placeholder="Role"
                  value={item.role || ''}
                  onChange={(e) => handleArrayItemChange('items', i, 'role', e.target.value)}
                  className="mb-1"
                />
                <Form.Control
                  size="sm"
                  as="textarea"
                  rows={2}
                  placeholder="Testimonial"
                  value={item.text || ''}
                  onChange={(e) => handleArrayItemChange('items', i, 'text', e.target.value)}
                  className="mb-1"
                />
                <Button variant="danger" size="sm" onClick={() => handleRemoveArrayItem('items', i)}>Remove</Button>
              </div>
            ))}
            <Button size="sm" variant="outline-primary" onClick={() => handleAddArrayItem('items', { name: 'Name', role: 'Role', text: 'Testimonial text', avatar: '👤' })}>
              + Add Testimonial
            </Button>
          </>
        )

      case COMPONENT_TYPES.PRICING:
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={localProps.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </Form.Group>
          </>
        )

      case COMPONENT_TYPES.GALLERY:
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={localProps.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Columns</Form.Label>
              <Form.Select
                value={localProps.columns || 3}
                onChange={(e) => handleChange('columns', parseInt(e.target.value))}
              >
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </Form.Select>
            </Form.Group>
          </>
        )

      case COMPONENT_TYPES.VIDEO:
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={localProps.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Video URL (YouTube embed)</Form.Label>
              <Form.Control
                value={localProps.videoUrl || ''}
                onChange={(e) => handleChange('videoUrl', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Aspect Ratio</Form.Label>
              <Form.Select
                value={localProps.aspectRatio || '16:9'}
                onChange={(e) => handleChange('aspectRatio', e.target.value)}
              >
                <option value="16:9">16:9</option>
                <option value="4:3">4:3</option>
              </Form.Select>
            </Form.Group>
          </>
        )

      case COMPONENT_TYPES.FAQ:
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={localProps.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </Form.Group>
            <Form.Label>FAQ Items</Form.Label>
            {(localProps.items || []).map((item, i) => (
              <div key={i} className="border p-2 mb-2 rounded">
                <Form.Control
                  size="sm"
                  placeholder="Question"
                  value={item.question || ''}
                  onChange={(e) => handleArrayItemChange('items', i, 'question', e.target.value)}
                  className="mb-1"
                />
                <Form.Control
                  size="sm"
                  as="textarea"
                  rows={2}
                  placeholder="Answer"
                  value={item.answer || ''}
                  onChange={(e) => handleArrayItemChange('items', i, 'answer', e.target.value)}
                  className="mb-1"
                />
                <Button variant="danger" size="sm" onClick={() => handleRemoveArrayItem('items', i)}>Remove</Button>
              </div>
            ))}
            <Button size="sm" variant="outline-primary" onClick={() => handleAddArrayItem('items', { question: 'Question?', answer: 'Answer' })}>
              + Add FAQ
            </Button>
          </>
        )

      case COMPONENT_TYPES.CARDS:
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={localProps.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Columns</Form.Label>
              <Form.Select
                value={localProps.columns || 3}
                onChange={(e) => handleChange('columns', parseInt(e.target.value))}
              >
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </Form.Select>
            </Form.Group>
            <Form.Label>Card Items</Form.Label>
            {(localProps.items || []).map((item, i) => (
              <div key={i} className="border p-2 mb-2 rounded">
                <Form.Control
                  size="sm"
                  placeholder="Icon (emoji)"
                  value={item.icon || ''}
                  onChange={(e) => handleArrayItemChange('items', i, 'icon', e.target.value)}
                  className="mb-1"
                />
                <Form.Control
                  size="sm"
                  placeholder="Title"
                  value={item.title || ''}
                  onChange={(e) => handleArrayItemChange('items', i, 'title', e.target.value)}
                  className="mb-1"
                />
                <Form.Control
                  size="sm"
                  placeholder="Description"
                  value={item.description || ''}
                  onChange={(e) => handleArrayItemChange('items', i, 'description', e.target.value)}
                  className="mb-1"
                />
                <Button variant="danger" size="sm" onClick={() => handleRemoveArrayItem('items', i)}>Remove</Button>
              </div>
            ))}
            <Button size="sm" variant="outline-primary" onClick={() => handleAddArrayItem('items', { icon: '🎯', title: 'Card', description: 'Description' })}>
              + Add Card
            </Button>
          </>
        )

      case COMPONENT_TYPES.TEAM:
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={localProps.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </Form.Group>
          </>
        )

      default:
        return <p>No properties available</p>
    }
  }

  return (
    <div className="p-3">
      <h6 className="mb-3">Properties</h6>
      <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {renderFields()}
      </div>
    </div>
  )
}

export default PropertiesPanel