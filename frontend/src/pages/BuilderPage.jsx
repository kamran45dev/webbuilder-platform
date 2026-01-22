import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Row, Col, Button, Navbar, ListGroup, Card, Nav, Modal, ButtonGroup, Dropdown } from 'react-bootstrap'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, TouchSensor } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import axios from '../services/api'
import { COMPONENT_LIST, DEFAULT_PROPS, PAGE_TEMPLATES } from '../components/builder/ComponentLibrary'
import ComponentRenderer from '../components/builder/ComponentRenderer'
import PropertiesPanel from '../components/builder/PropertiesPanel'

function SortableComponent({ component, isSelected, onClick, onDuplicate, onContextMenu }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: component.id 
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div ref={setNodeRef} style={style} onContextMenu={(e) => onContextMenu(e, component)}>
      <div className="position-relative">
        <div 
          {...attributes} 
          {...listeners}
          className="position-absolute top-0 start-0 m-2 bg-secondary text-white px-2 py-1 rounded d-none d-md-block"
          style={{ cursor: 'grab', zIndex: 11, fontSize: '12px' }}
        >
          ⋮⋮
        </div>
        
        {isSelected && (
          <Button
            variant="info"
            size="sm"
            className="position-absolute top-0 start-50 translate-middle-x m-2"
            style={{ zIndex: 10 }}
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate(component)
            }}
          >
            📋
          </Button>
        )}
        
        <ComponentRenderer 
          component={component} 
          isSelected={isSelected} 
          onClick={onClick} 
        />
      </div>
    </div>
  )
}

export default function BuilderPage() {
  const { projectId } = useParams()
  const [project, setProject] = useState(null)
  const [pages, setPages] = useState([])
  const [selectedPage, setSelectedPage] = useState(null)
  const [components, setComponents] = useState([])
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [mobileTab, setMobileTab] = useState('canvas')
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, component: null })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5
      }
    })
  )

  useEffect(() => {
    fetchProject()
    fetchPages()
  }, [projectId])

  useEffect(() => {
    if (components.length > 0 || historyIndex === -1) {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(JSON.parse(JSON.stringify(components)))
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
  }, [components])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Delete key
      if (e.key === 'Delete' && selectedComponent) {
        deleteComponent()
      }
      
      // Ctrl+Z (Undo)
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      
      // Ctrl+Y or Ctrl+Shift+Z (Redo)
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault()
        redo()
      }
      
      // Ctrl+D (Duplicate)
      if (e.ctrlKey && e.key === 'd' && selectedComponent) {
        e.preventDefault()
        duplicateComponent(selectedComponent)
      }
      
      // Escape (Deselect)
      if (e.key === 'Escape') {
        setSelectedComponent(null)
      }

      // Arrow Up (Move component up)
      if (e.key === 'ArrowUp' && e.ctrlKey && selectedComponent) {
        e.preventDefault()
        moveComponentUp()
      }

      // Arrow Down (Move component down)
      if (e.key === 'ArrowDown' && e.ctrlKey && selectedComponent) {
        e.preventDefault()
        moveComponentDown()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedComponent, historyIndex, components])

  // Close context menu on click
  useEffect(() => {
    const handleClick = () => setContextMenu({ show: false, x: 0, y: 0, component: null })
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  const fetchProject = async () => {
    const res = await axios.get(`/api/projects/${projectId}`)
    setProject(res.data.project)
  }

  const fetchPages = async () => {
    const res = await axios.get(`/api/projects/${projectId}/pages`)
    setPages(res.data.pages)
    if (res.data.pages.length > 0) {
      selectPage(res.data.pages[0])
    }
  }

  const selectPage = (page) => {
    setSelectedPage(page)
    const layout = page.layout_json ? JSON.parse(page.layout_json) : []
    setComponents(layout)
    setSelectedComponent(null)
    setHistory([layout])
    setHistoryIndex(0)
  }

  const addPage = async () => {
    const slug = prompt('Enter page slug (e.g., about, contact):')
    if (!slug) return
    await axios.post(`/api/projects/${projectId}/pages`, {
      title: slug.charAt(0).toUpperCase() + slug.slice(1),
      slug: slug
    })
    fetchPages()
  }

  const applyTemplate = (templateKey) => {
    const template = PAGE_TEMPLATES[templateKey]
    const newComponents = template.components.map((comp, index) => ({
      id: `${comp.type}-${Date.now()}-${index}`,
      type: comp.type,
      props: { ...comp.props }
    }))
    setComponents(newComponents)
    setShowTemplateModal(false)
    setMobileTab('canvas')
  }

  const addComponent = (type) => {
    const newComponent = {
      id: `${type}-${Date.now()}`,
      type,
      props: { ...DEFAULT_PROPS[type] }
    }
    setComponents([...components, newComponent])
    setMobileTab('canvas')
  }

  const duplicateComponent = (component) => {
    const duplicated = {
      ...component,
      id: `${component.type}-${Date.now()}-copy`,
      props: { ...component.props }
    }
    const index = components.findIndex(c => c.id === component.id)
    const newComponents = [...components]
    newComponents.splice(index + 1, 0, duplicated)
    setComponents(newComponents)
    setSelectedComponent(duplicated)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const updateComponent = (updated) => {
    setComponents(components.map(c => c.id === updated.id ? updated : c))
    setSelectedComponent(updated)
  }

  const deleteComponent = () => {
    if (!selectedComponent) return
    setComponents(components.filter(c => c.id !== selectedComponent.id))
    setSelectedComponent(null)
    setMobileTab('canvas')
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setComponents(JSON.parse(JSON.stringify(history[historyIndex - 1])))
      setSelectedComponent(null)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setComponents(JSON.parse(JSON.stringify(history[historyIndex + 1])))
      setSelectedComponent(null)
    }
  }

  const moveComponentUp = () => {
    if (!selectedComponent) return
    const index = components.findIndex(c => c.id === selectedComponent.id)
    if (index > 0) {
      const newComponents = [...components]
      ;[newComponents[index], newComponents[index - 1]] = [newComponents[index - 1], newComponents[index]]
      setComponents(newComponents)
    }
  }

  const moveComponentDown = () => {
    if (!selectedComponent) return
    const index = components.findIndex(c => c.id === selectedComponent.id)
    if (index < components.length - 1) {
      const newComponents = [...components]
      ;[newComponents[index], newComponents[index + 1]] = [newComponents[index + 1], newComponents[index]]
      setComponents(newComponents)
    }
  }

  const handleContextMenu = (e, component) => {
    e.preventDefault()
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      component
    })
    setSelectedComponent(component)
  }

  const saveLayout = async () => {
    if (!selectedPage) return
    try {
      await axios.put(`/api/projects/pages/${selectedPage.id}`, {
        layout_json: JSON.stringify(components)
      })
      alert('Layout saved!')
    } catch (err) {
      console.error(err)
      alert('Save failed')
    }
  }

  const deployPreview = async () => {
    await saveLayout()
    const res = await axios.post(`/api/projects/${projectId}/deploy/preview`)
    alert(`Preview: ${res.data.url}`)
  }

  const deployProduction = async () => {
    await saveLayout()
    const res = await axios.post(`/api/projects/${projectId}/deploy/production`)
    alert(`Production: ${res.data.url}`)
  }

  const handleComponentClick = (component) => {
    setSelectedComponent(component)
    setMobileTab('properties')
  }

  const categories = ['All', ...new Set(COMPONENT_LIST.map(c => c.category))]
  const filteredComponents = selectedCategory === 'All' 
    ? COMPONENT_LIST 
    : COMPONENT_LIST.filter(c => c.category === selectedCategory)

  // Desktop Layout
  const DesktopLayout = () => (
    <Row className="h-100 d-none d-md-flex">
      {/* Pages & Components Sidebar */}
      <Col md={2} className="bg-light border-end p-3 overflow-auto">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6>Pages</h6>
          <Button variant="link" size="sm" onClick={addPage}>+</Button>
        </div>
        <ListGroup className="mb-3">
          {pages.map(page => (
            <ListGroup.Item
              key={page.id}
              active={selectedPage?.id === page.id}
              onClick={() => selectPage(page)}
              style={{ cursor: 'pointer' }}
            >
              {page.title}
            </ListGroup.Item>
          ))}
        </ListGroup>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0">Components</h6>
          <Button variant="outline-primary" size="sm" onClick={() => setShowTemplateModal(true)}>
            📄
          </Button>
        </div>

        <Nav variant="pills" className="flex-column mb-2" style={{ fontSize: '0.85rem' }}>
          {categories.map(cat => (
            <Nav.Link
              key={cat}
              active={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
              className="py-1 px-2"
            >
              {cat}
            </Nav.Link>
          ))}
        </Nav>

        {filteredComponents.map(comp => (
          <Card
            key={comp.type}
            className="mb-2 component-card"
            style={{ cursor: 'pointer' }}
            onClick={() => addComponent(comp.type)}
          >
            <Card.Body className="p-2 text-center">
              <div style={{ fontSize: '20px' }}>{comp.icon}</div>
              <small style={{ fontSize: '0.75rem' }}>{comp.label}</small>
            </Card.Body>
          </Card>
        ))}
      </Col>

      {/* Canvas */}
      <Col md={7} className="p-0 bg-white overflow-auto">
        <div className="p-4">
          {!previewMode && (
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>{selectedPage?.title || 'Select a page'}</h5>
              <div className="d-flex gap-2">
                <ButtonGroup size="sm">
                  <Button variant="outline-secondary" onClick={undo} disabled={historyIndex <= 0} title="Undo (Ctrl+Z)">
                    ↶
                  </Button>
                  <Button variant="outline-secondary" onClick={redo} disabled={historyIndex >= history.length - 1} title="Redo (Ctrl+Y)">
                    ↷
                  </Button>
                </ButtonGroup>
                {selectedComponent && (
                  <ButtonGroup size="sm">
                    <Button variant="outline-secondary" onClick={moveComponentUp} title="Move Up (Ctrl+↑)">
                      ⬆
                    </Button>
                    <Button variant="outline-secondary" onClick={moveComponentDown} title="Move Down (Ctrl+↓)">
                      ⬇
                    </Button>
                    <Button variant="outline-info" onClick={() => duplicateComponent(selectedComponent)} title="Duplicate (Ctrl+D)">
                      📋
                    </Button>
                    <Button variant="outline-danger" onClick={deleteComponent} title="Delete (Del)">
                      🗑️
                    </Button>
                  </ButtonGroup>
                )}
                <Button variant="outline-primary" size="sm" onClick={() => setPreviewMode(!previewMode)}>
                  {previewMode ? '✏️ Edit' : '👁️ Preview'}
                </Button>
              </div>
            </div>
          )}
          
          {previewMode && (
            <div className="mb-3 text-center">
              <Button variant="secondary" size="sm" onClick={() => setPreviewMode(false)}>
                ✏️ Exit Preview
              </Button>
            </div>
          )}

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={components} strategy={verticalListSortingStrategy}>
              {components.map((component) => (
                <SortableComponent
                  key={component.id}
                  component={component}
                  isSelected={!previewMode && selectedComponent?.id === component.id}
                  onClick={() => !previewMode && handleComponentClick(component)}
                  onDuplicate={duplicateComponent}
                  onContextMenu={handleContextMenu}
                />
              ))}
            </SortableContext>
          </DndContext>
          {components.length === 0 && (
            <div className="text-center text-muted mt-5">
              <p>Drag components here to start building</p>
              <p className="small">Or press Ctrl+V to paste</p>
              <Button variant="outline-primary" onClick={() => setShowTemplateModal(true)}>
                Choose a template
              </Button>
            </div>
          )}
        </div>
      </Col>

      {/* Properties Panel */}
      <Col md={3} className="bg-light border-start p-0 overflow-auto">
        <PropertiesPanel component={selectedComponent} onUpdate={updateComponent} />
        {selectedComponent && (
          <div className="p-3 border-top">
            <div className="d-grid gap-2">
              <Button variant="outline-info" size="sm" onClick={() => duplicateComponent(selectedComponent)}>
                📋 Duplicate
              </Button>
              <Button variant="danger" size="sm" onClick={deleteComponent}>
                🗑️ Delete
              </Button>
            </div>
            <div className="mt-3 p-2 bg-white rounded">
              <small className="text-muted d-block mb-1"><strong>Keyboard Shortcuts:</strong></small>
              <small className="text-muted d-block">Delete - Remove</small>
              <small className="text-muted d-block">Ctrl+D - Duplicate</small>
              <small className="text-muted d-block">Ctrl+Z - Undo</small>
              <small className="text-muted d-block">Ctrl+Y - Redo</small>
              <small className="text-muted d-block">Ctrl+↑/↓ - Move</small>
            </div>
          </div>
        )}
      </Col>
    </Row>
  )

  // Mobile Layout
  const MobileLayout = () => (
    <div className="d-md-none h-100 d-flex flex-column">
      <Nav variant="tabs" className="flex-shrink-0">
        <Nav.Item>
          <Nav.Link active={mobileTab === 'components'} onClick={() => setMobileTab('components')}>
            Components
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active={mobileTab === 'canvas'} onClick={() => setMobileTab('canvas')}>
            Canvas
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active={mobileTab === 'properties'} onClick={() => setMobileTab('properties')}>
            Properties
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <div className="flex-grow-1 overflow-auto">
        {mobileTab === 'components' && (
          <div className="p-3">
            <div className="mb-3">
              <h6 className="mb-2">Pages</h6>
              <ListGroup>
                {pages.map(page => (
                  <ListGroup.Item
                    key={page.id}
                    active={selectedPage?.id === page.id}
                    onClick={() => {
                      selectPage(page)
                      setMobileTab('canvas')
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {page.title}
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Button variant="outline-primary" size="sm" className="w-100 mt-2" onClick={addPage}>
                + Add Page
              </Button>
            </div>

            <Button variant="primary" size="sm" className="w-100 mb-3" onClick={() => setShowTemplateModal(true)}>
              📄 Use Template
            </Button>

            <h6 className="mb-3">Add Components</h6>
            <Nav variant="pills" className="flex-wrap mb-2">
              {categories.map(cat => (
                <Nav.Link
                  key={cat}
                  active={selectedCategory === cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="py-1 px-2 small mb-1"
                >
                  {cat}
                </Nav.Link>
              ))}
            </Nav>
            <Row>
              {filteredComponents.map(comp => (
                <Col xs={6} key={comp.type} className="mb-2">
                  <Card
                    style={{ cursor: 'pointer' }}
                    onClick={() => addComponent(comp.type)}
                  >
                    <Card.Body className="p-3 text-center">
                      <div style={{ fontSize: '32px' }}>{comp.icon}</div>
                      <small>{comp.label}</small>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {mobileTab === 'canvas' && (
          <div className="p-3">
            <div className="mb-3 d-flex gap-2 justify-content-between">
              <ButtonGroup size="sm">
                <Button variant="outline-secondary" onClick={undo} disabled={historyIndex <= 0}>↶</Button>
                <Button variant="outline-secondary" onClick={redo} disabled={historyIndex >= history.length - 1}>↷</Button>
              </ButtonGroup>
              <h6>{selectedPage?.title}</h6>
              {selectedComponent && (
                <ButtonGroup size="sm">
                  <Button variant="outline-info" onClick={() => duplicateComponent(selectedComponent)}>📋</Button>
                  <Button variant="outline-danger" onClick={deleteComponent}>🗑️</Button>
                </ButtonGroup>
              )}
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={components} strategy={verticalListSortingStrategy}>
                {components.map((component) => (
                  <SortableComponent
                    key={component.id}
                    component={component}
                    isSelected={selectedComponent?.id === component.id}
                    onClick={() => handleComponentClick(component)}
                    onDuplicate={duplicateComponent}
                    onContextMenu={handleContextMenu}
                  />
                ))}
              </SortableContext>
            </DndContext>
            {components.length === 0 && (
              <p className="text-center text-muted">Add components from the Components tab</p>
            )}
          </div>
        )}

        {mobileTab === 'properties' && (
          <div>
            <PropertiesPanel component={selectedComponent} onUpdate={updateComponent} />
            {selectedComponent && (
              <div className="p-3">
                <Button variant="danger" size="sm" className="w-100" onClick={deleteComponent}>
                  🗑️ Delete Component
                </Button>
              </div>
            )}
            {!selectedComponent && (
              <div className="p-3 text-muted text-center">
                Select a component from the Canvas to edit
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      <Navbar bg="light" className="border-bottom flex-shrink-0">
        <Container fluid>
          <Navbar.Brand>{project?.name}</Navbar.Brand>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" size="sm" onClick={saveLayout} title="Save (Ctrl+S)">
              💾 Save
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={deployPreview}>
              👁️ Preview
            </Button>
            <Button variant="primary" size="sm" onClick={deployProduction}>
              🚀 Publish
            </Button>
          </div>
        </Container>
      </Navbar>

      <Container fluid className="p-0" style={{ height: 'calc(100vh - 112px)' }}>
        <DesktopLayout />
        <MobileLayout />
      </Container>

      {/* Template Modal */}
      <Modal show={showTemplateModal} onHide={() => setShowTemplateModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Choose a Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {Object.entries(PAGE_TEMPLATES).map(([key, template]) => (
              <Col md={6} key={key} className="mb-3">
                <Card style={{ cursor: 'pointer' }} onClick={() => applyTemplate(key)}>
                  <Card.Body className="text-center">
                    <div style={{ fontSize: '48px' }}>{template.icon}</div>
                    <h5 className="mt-2">{template.name}</h5>
                    <small className="text-muted">
                      {template.components.length} components
                    </small>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
      </Modal>

      {/* Context Menu */}
      {contextMenu.show && (
        <div
          className="bg-white border shadow-sm rounded"
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 9999,
            minWidth: '150px'
          }}
        >
          <div className="list-group list-group-flush">
            <button
              className="list-group-item list-group-item-action d-flex align-items-center gap-2"
              onClick={() => {
                handleComponentClick(contextMenu.component)
                setContextMenu({ show: false, x: 0, y: 0, component: null })
              }}
            >
              ✏️ Edit
            </button>
            <button
              className="list-group-item list-group-item-action d-flex align-items-center gap-2"
              onClick={() => {
                duplicateComponent(contextMenu.component)
                setContextMenu({ show: false, x: 0, y: 0, component: null })
              }}
            >
              📋 Duplicate
            </button>
            <button
              className="list-group-item list-group-item-action d-flex align-items-center gap-2"
              onClick={() => {
                moveComponentUp()
                setContextMenu({ show: false, x: 0, y: 0, component: null })
              }}
            >
              ⬆ Move Up
            </button>
            <button
              className="list-group-item list-group-item-action d-flex align-items-center gap-2"
              onClick={() => {
                moveComponentDown()
                setContextMenu({ show: false, x: 0, y: 0, component: null })
              }}
            >
              ⬇ Move Down
            </button>
            <button
              className="list-group-item list-group-item-action text-danger d-flex align-items-center gap-2"
              onClick={() => {
                deleteComponent()
                setContextMenu({ show: false, x: 0, y: 0, component: null })
              }}
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      )}

      <style>{`
        .component-card {
          transition: all 0.2s ease;
        }
        .component-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </>
  )
}