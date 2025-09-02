import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../utils/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center min-vh-75 align-items-center">
        <Col md={6} lg={4}>
          <div className="text-center mb-4 animate-fade-in">
            <div className="display-1 mb-3">🎯</div>
            <h2 className="fw-bold">Welcome Back!</h2>
            <p className="text-muted">Sign in to continue your interview prep</p>
          </div>
          <Card className="glass-card p-4 animate-slide-up">
            <Card.Body>
              {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-500">📧 Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter your email"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-500">🔒 Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Enter your password"
                    required
                  />
                </Form.Group>
                <Button type="submit" className="btn-gradient w-100 py-3 fw-bold" disabled={loading}>
                  {loading ? <span className="loading-dots">Logging in</span> : '🚀 Login'}
                </Button>
              </Form>
              <div className="text-center mt-4">
                <span className="text-muted">Don't have an account? </span>
                <Link to="/register" className="fw-bold text-decoration-none">Register here</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;