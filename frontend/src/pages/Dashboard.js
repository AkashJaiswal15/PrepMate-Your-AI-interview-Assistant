import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ListGroup, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI, resumeAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await dashboardAPI.getDashboard();
      setData(response.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      await resumeAPI.upload(formData);
      setShowUpload(false);
      loadDashboard();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  return (
    <Container className="animate-fade-in">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h2 className="fw-bold mb-2">📊 Dashboard</h2>
              <p className="text-muted">Track your interview progress and performance</p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <Button className="btn-gradient px-4" onClick={() => navigate('/interview')}>
                🚀 Start New Interview
              </Button>
              <Button variant="outline-primary" className="rounded-pill px-4" onClick={() => setShowUpload(true)}>
                📄 Upload Resume
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mb-4 g-4">
        <Col md={4}>
          <Card className="glass-card text-center p-4 card-hover animate-slide-up">
            <Card.Body>
              <div className="display-4 fw-bold mb-2" style={{color: 'var(--primary)'}}>
                {data?.stats?.totalSessions || 0}
              </div>
              <p className="text-muted mb-0">📝 Total Sessions</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="glass-card text-center p-4 card-hover animate-slide-up" style={{animationDelay: '0.2s'}}>
            <Card.Body>
              <div className="display-4 fw-bold mb-2" style={{color: 'var(--success)'}}>
                {Math.round(data?.stats?.avgScore || 0)}%
              </div>
              <p className="text-muted mb-0">🎯 Average Score</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="glass-card text-center p-4 card-hover animate-slide-up" style={{animationDelay: '0.4s'}}>
            <Card.Body>
              <div className="display-4 fw-bold mb-2" style={{color: 'var(--warning)'}}>
                {data?.stats?.totalQuestions || 0}
              </div>
              <p className="text-muted mb-0">❓ Questions Answered</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card className="glass-card animate-slide-up" style={{animationDelay: '0.6s'}}>
            <Card.Header className="bg-transparent border-0 p-4">
              <h5 className="fw-bold mb-0">📅 Recent Sessions</h5>
            </Card.Header>
            <Card.Body className="p-4">
              {data?.sessions?.length ? (
                <div className="d-flex flex-column gap-3">
                  {data.sessions.map((session, index) => (
                    <div key={session._id} className="p-3 rounded-3 d-flex justify-content-between align-items-center" 
                         style={{background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.1)'}}>
                      <div>
                        <div className="fw-bold text-capitalize mb-1">🎯 {session.role}</div>
                        <small className="text-muted">
                          📅 {new Date(session.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Badge bg="primary" className="badge-custom">
                          {session.questions.length} questions
                        </Badge>
                        <Button 
                          size="sm" 
                          className="btn-gradient px-3"
                          onClick={() => navigate(`/session/${session._id}`)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <div className="display-1 mb-3">🚀</div>
                  <p className="text-muted fs-5">No sessions yet. Start your first interview!</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="glass-card animate-slide-up" style={{animationDelay: '0.8s'}}>
            <Card.Header className="bg-transparent border-0 p-4">
              <h5 className="fw-bold mb-0">📌 Pinned Questions</h5>
            </Card.Header>
            <Card.Body className="p-4">
              {data?.pinnedQuestions?.length ? (
                <div className="d-flex flex-column gap-3">
                  {data.pinnedQuestions.map((item, index) => (
                    <div key={index} className="p-3 rounded-3" 
                         style={{background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)'}}>
                      <small className="text-success fw-500">{item.question}</small>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="fs-1 mb-3">📌</div>
                  <p className="text-muted">No pinned questions yet.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showUpload} onHide={() => setShowUpload(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Resume</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input 
            type="file" 
            accept=".pdf,.doc,.docx" 
            onChange={handleResumeUpload}
            disabled={uploading}
            className="form-control"
          />
          {uploading && <LoadingSpinner text="Uploading and parsing resume..." />}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Dashboard;