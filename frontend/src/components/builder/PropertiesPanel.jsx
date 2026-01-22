import { useState, useEffect, useRef } from 'react'
import { Form, Button } from 'react-bootstrap'
import { COMPONENT_TYPES } from './ComponentLibrary'

function PropertiesPanel({ component, onUpdate }) {
  const [localProps, setLocalProps] = useState({})
  const updateTimeoutRef = useRef(null)
  const componentIdRef = useRef(null)

  // Only update local state when component ID changes
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

  // Debounced update to parent
  const debouncedUpdate = (updatedProps) => {
    if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current)
    updateTimeoutRef.current = setTimeout(() => {
      onUpdate({ ...component, props: updatedProps })
    }, 300) // 300ms is smooth and responsive
  }

  const handleChange = (key, value) => {
    const updated = { ...localProps, [key]: value }
    setLocalProps(updated)
    debouncedUpdate(updated)
  }

  const handleArrayItemChange = (arrayKey, index, itemKey, value) => {
    const newArray = [...(localProps[arrayKey] || [])]
    newArray[index] = { ...newArray[index], [itemKey]: value }
    const updated = { ...localProps, [arrayKey]: newArray }
    setLocalProps(updated)
    debouncedUpdate(updated)
  }

  const handleAddArrayItem = (arrayKey, defaultItem) => {
    const newArray = [...(localProps[arrayKey] || []), { ...defaultItem, id: Date.now() }]
    const updated = { ...localProps, [arrayKey]: newArray }
    setLocalProps(updated)
    onUpdate({ ...component, props: updated })
  }

  const handleRemoveArrayItem = (arrayKey, id) => {
    const newArray = (localProps[arrayKey] || []).filter(item => item.id !== id)
    const updated = { ...localProps, [arrayKey]: newArray }
    setLocalProps(updated)
    onUpdate({ ...component, props: updated })
  }

  // Render input fields (example for HERO & NAVBAR, replicate for other types)
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
            {/* other fields similarly */}
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
            <Form.Label>Links</Form.Label>
            {(localProps.links || []).map((link, i) => (
              <div key={link.id} className="border p-2 mb-2 rounded">
                <Form.Control
                  size="sm"
                  placeholder="Text"
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
                <Button variant="danger" size="sm" onClick={() => handleRemoveArrayItem('links', link.id)}>Remove</Button>
              </div>
            ))}
            <Button size="sm" variant="outline-primary" onClick={() => handleAddArrayItem('links', { text: '', url: '' })}>
              + Add Link
            </Button>
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
