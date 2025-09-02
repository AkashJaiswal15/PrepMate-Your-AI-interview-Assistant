import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const SessionView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, [id]);

  const loadSession = async () => {
    try {
      const response = await dashboardAPI.getSession(id);
      setSession(response.data);
    } catch (error) {
      console.error('Failed to load session:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading session..." />;

  if (!session) {
    return (
      <Container>
        <div className="text-center py-5">
          <h3>Session not found</h3>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold">🎯 {session.role} Interview</h2>
              <p className="text-muted">
                📅 {new Date(session.createdAt).toLocaleDateString()} • 
                {session.questions.length} questions
              </p>
            </div>
            <Button variant="outline-primary" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          {session.questions.map((question, index) => (
            <Card key={index} className="glass-card mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Question {index + 1}</h5>
                <div>
                  <Badge bg="primary" className="me-2">{question.difficulty}</Badge>
                  {question.pinned && <Badge bg="warning">📌 Pinned</Badge>}
                </div>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <strong className="text-primary">❓ Question:</strong>
                  <p className="mt-2">{question.text}</p>
                </div>
                
                {question.userAnswer && (
                  <div className="mb-3">
                    <strong className="text-success">💬 Your Answer:</strong>
                    <p className="mt-2 p-3 bg-light rounded">{question.userAnswer}</p>
                  </div>
                )}
                
                {question.aiFeedback && (
                  <div className="mb-3">
                    <strong className="text-info">🤖 AI Feedback:</strong>
                    <p className="mt-2 p-3 bg-info bg-opacity-10 rounded">{question.aiFeedback}</p>
                  </div>
                )}
                
                {!question.userAnswer && (
                  <div className="text-muted fst-italic">No answer provided</div>
                )}
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default SessionView;