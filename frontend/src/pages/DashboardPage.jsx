import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from '../services/api'

export default function DashboardPage() {
  const [projects, setProjects] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects')
      setProjects(res.data.projects)
    } catch (err) {
      console.error(err)
    }
  }

  const createProject = async () => {
    try {
      const res = await axios.post('/api/projects', {
        name: 'New Project'
      })
      navigate(`/builder/${res.data.project.id}`)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteClick = (project, e) => {
    e.stopPropagation()
    setProjectToDelete(project)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/projects/${projectToDelete.id}`)
      setShowDeleteModal(false)
      setProjectToDelete(null)
      fetchProjects()
    } catch (err) {
      console.error(err)
      alert('Failed to delete project')
    }
  }

  return (
    <>
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>My Projects</h2>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" onClick={() => navigate('/templates')}>
              📄 Browse Templates
            </Button>
            <Button variant="primary" onClick={createProject}>+ New Project</Button>
          </div>
        </div>

        <Row>
          {projects.map(project => (
            <Col md={4} key={project.id} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{project.name}</Card.Title>
                  <Card.Text className="text-muted small">
                    Created {new Date(project.created_at).toLocaleDateString()}
                  </Card.Text>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-primary" 
                      onClick={() => navigate(`/builder/${project.id}`)}
                      className="flex-grow-1"
                    >
                      Open
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      onClick={(e) => handleDeleteClick(project, e)}
                    >
                      🗑️
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {projects.length === 0 && (
          <div className="text-center text-muted mt-5">
            <h4>No projects yet</h4>
            <p>Create your first project or start with a template!</p>
            <Button variant="primary" className="me-2" onClick={createProject}>
              + New Blank Project
            </Button>
            <Button variant="outline-primary" onClick={() => navigate('/templates')}>
              📄 Browse Templates
            </Button>
          </div>
        )}
      </Container>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{projectToDelete?.name}</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}