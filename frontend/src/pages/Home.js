import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <Container>
        <Row className="text-center mb-5 py-5">
          <Col>
            <div className="animate-bounce mb-4">
              <span style={{fontSize: '4rem'}}>🎯</span>
            </div>
            <h1 className="display-3 mb-3 fw-bold" style={{background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              PrepMate
            </h1>
            <p className="lead fs-4 mb-3">AI-Powered Interview Assistant</p>
            <p className="text-muted fs-5 mb-4">
              Get personalized interview questions, practice with AI feedback, and track your progress
            </p>
            {!isAuthenticated && (
              <div className="mt-4 animate-slide-up">
                <Button className="btn-gradient me-3 px-5 py-3 fs-5" onClick={() => navigate('/register')}>
                  🚀 Get Started
                </Button>
                <Button variant="outline-primary" size="lg" className="px-5 py-3 fs-5 rounded-pill" onClick={() => navigate('/login')}>
                  Login
                </Button>
              </div>
            )}
          </Col>
        </Row>

        <Row className="mb-5 g-4">
          <Col md={4}>
            <Card className="glass-card h-100 text-center p-4 animate-slide-up">
              <Card.Body>
                <div className="feature-icon">🤖</div>
                <h4 className="fw-bold mb-3">AI-Generated Questions</h4>
                <p className="text-muted">Get personalized interview questions based on your skills and target role</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="glass-card h-100 text-center p-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <Card.Body>
                <div className="feature-icon">📊</div>
                <h4 className="fw-bold mb-3">Real-time Feedback</h4>
                <p className="text-muted">Receive instant AI feedback on your answers with scoring and improvement tips</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="glass-card h-100 text-center p-4 animate-slide-up" style={{animationDelay: '0.4s'}}>
              <Card.Body>
                <div className="feature-icon">📈</div>
                <h4 className="fw-bold mb-3">Progress Tracking</h4>
                <p className="text-muted">Monitor your improvement over time with detailed analytics and session history</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-5 g-4">
          <Col md={6}>
            <Card className="glass-card p-4 animate-slide-up" style={{animationDelay: '0.6s'}}>
              <Card.Body>
                <h4 className="fw-bold mb-4">🎯 Role-Specific Practice</h4>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {['Frontend Development', 'Backend Development', 'Full Stack', 'Data Science', 'DevOps'].map((role, index) => (
                    <span key={index} className="badge bg-primary badge-custom">{role}</span>
                  ))}
                </div>
                <div className="mt-3 p-3 rounded" style={{background: 'rgba(99, 102, 241, 0.1)', border: '1px dashed rgba(99, 102, 241, 0.3)'}}>
                  <h6 className="fw-bold mb-2">✨ And Much More:</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {['Mobile Development', 'Machine Learning', 'Cloud Architecture', 'Cybersecurity', 'QA Engineering', 'Product Management', 'System Design'].map((role, index) => (
                      <span key={index} className="badge bg-secondary badge-custom" style={{fontSize: '0.75rem'}}>{role}</span>
                    ))}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="glass-card p-4 animate-slide-up" style={{animationDelay: '0.8s'}}>
              <Card.Body>
                <h4 className="fw-bold mb-4">🚀 Key Features</h4>
                <div className="text-start">
                  {[
                    '📄 Resume parsing and skill extraction',
                    '🎤 Voice input support', 
                    '📌 Question pinning and favorites',
                    '📊 Session export and sharing',
                    '📈 Progress metrics and analytics'
                  ].map((feature, index) => (
                    <div key={index} className="mb-2 p-2 rounded" style={{background: 'rgba(99, 102, 241, 0.1)'}}>
                      {feature}
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;