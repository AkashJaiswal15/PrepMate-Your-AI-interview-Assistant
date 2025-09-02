import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const NavigationBar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="gradient-bg mb-4 py-3">
      <Container>
        <Navbar.Brand href="/" className="fw-bold fs-3">
          🎯 PrepMate
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated && (
              <>
                <Nav.Link href="/dashboard" className="text-white fw-500 mx-2">📊 Dashboard</Nav.Link>
                <Nav.Link href="/interview" className="text-white fw-500 mx-2">🚀 New Interview</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <>
                <Navbar.Text className="me-3 text-white-50">👋 Welcome, {user.name}</Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout} className="rounded-pill px-4">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link href="/login" className="text-white fw-500 mx-2">Login</Nav.Link>
                <Nav.Link href="/register" className="text-white fw-500 mx-2">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;