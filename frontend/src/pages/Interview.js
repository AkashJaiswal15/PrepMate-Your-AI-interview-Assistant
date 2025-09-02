import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { aiAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Interview = () => {
  const [step, setStep] = useState('setup'); // setup, questions, feedback
  const [sessionData, setSessionData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');

  const [setupForm, setSetupForm] = useState({
    role: 'general',
    difficulty: 'medium'
  });

  const startInterview = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await aiAPI.generateQuestions(setupForm);
      setSessionData(response.data);
      setStep('questions');
    } catch (error) {
      console.error('Failed to generate questions:', error);
      setError(error.response?.data?.message || 'Failed to generate questions. Please check your OpenAI API key.');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    
    setLoading(true);
    try {
      const response = await aiAPI.submitAnswer({
        sessionId: sessionData.sessionId,
        questionIndex: currentQuestion,
        answer
      });
      setFeedback(response.data);
      setStep('feedback');
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < sessionData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer('');
      setFeedback(null);
      setStep('questions');
    } else {
      // Interview complete
      setStep('complete');
    }
  };

  const togglePin = async () => {
    try {
      await aiAPI.togglePin({
        sessionId: sessionData.sessionId,
        questionIndex: currentQuestion
      });
    } catch (error) {
      console.error('Failed to toggle pin:', error);
    }
  };

  const startRecording = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setAnswer(prev => prev + ' ' + transcript);
      };
      
      recognition.start();
    }
  };

  if (step === 'setup') {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="text-center mb-5 animate-fade-in">
              <div className="display-1 mb-3">🎯</div>
              <h2 className="fw-bold">Setup Your Interview</h2>
              <p className="text-muted fs-5">Choose your role and difficulty level</p>
            </div>
            <Card className="glass-card p-5 animate-slide-up">
              <Card.Body>
                {error && <Alert variant="danger" className="rounded-3 mb-4">{error}</Alert>}
                <Form>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold fs-5 mb-3">💼 Interview Role</Form.Label>
                    <Form.Select 
                      value={setupForm.role}
                      onChange={(e) => setSetupForm({...setupForm, role: e.target.value})}
                      className="py-3 fs-5"
                    >
                      <option value="general">🌐 General</option>
                      <option value="frontend">🎨 Frontend Developer</option>
                      <option value="backend">⚙️ Backend Developer</option>
                      <option value="fullstack">🚀 Full Stack Developer</option>
                      <option value="mobile">📱 Mobile Developer</option>
                      <option value="data-science">📊 Data Science</option>
                      <option value="machine-learning">🤖 Machine Learning Engineer</option>
                      <option value="devops">🔧 DevOps Engineer</option>
                      <option value="cloud">☁️ Cloud Architect</option>
                      <option value="cybersecurity">🔒 Cybersecurity</option>
                      <option value="qa">🧪 QA Engineer</option>
                      <option value="product-manager">📋 Product Manager</option>
                      <option value="system-design">🏗️ System Design</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-5">
                    <Form.Label className="fw-bold fs-5 mb-3">🎯 Difficulty Level</Form.Label>
                    <div className="d-flex gap-3">
                      {[{value: 'easy', label: 'Easy', color: 'success'}, 
                        {value: 'medium', label: 'Medium', color: 'warning'}, 
                        {value: 'hard', label: 'Hard', color: 'danger'}].map(level => (
                        <div key={level.value} className="flex-fill">
                          <input 
                            type="radio" 
                            className="btn-check" 
                            name="difficulty" 
                            id={level.value}
                            value={level.value}
                            checked={setupForm.difficulty === level.value}
                            onChange={(e) => setSetupForm({...setupForm, difficulty: e.target.value})}
                          />
                          <label className={`btn btn-outline-${level.color} w-100 py-3`} htmlFor={level.value}>
                            {level.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </Form.Group>
                  <Button onClick={startInterview} disabled={loading} className="btn-gradient w-100 py-4 fs-4 fw-bold">
                    {loading ? <span className="loading-dots">Generating Questions</span> : '🚀 Start Interview'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (step === 'questions') {
    return (
      <Container>
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Question {currentQuestion + 1} of {sessionData.questions.length}</h4>
              <Badge bg="secondary">{setupForm.difficulty}</Badge>
            </div>
            <Card className="mb-4">
              <Card.Body>
                <h5>{sessionData.questions[currentQuestion]}</h5>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Your Answer</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                  />
                </Form.Group>
                <div className="d-flex gap-2">
                  <Button onClick={submitAnswer} disabled={loading || !answer.trim()}>
                    {loading ? 'Analyzing...' : 'Submit Answer'}
                  </Button>
                  <Button variant="outline-secondary" onClick={startRecording} disabled={isRecording}>
                    {isRecording ? 'Recording...' : '🎤 Voice Input'}
                  </Button>
                  <Button variant="outline-primary" onClick={togglePin}>
                    📌 Pin Question
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (step === 'feedback') {
    return (
      <Container>
        <Row>
          <Col>
            <Card className="mb-4">
              <Card.Header>
                <h5>AI Feedback</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <strong>Score: </strong>
                  <Badge bg={feedback.score >= 70 ? 'success' : feedback.score >= 50 ? 'warning' : 'danger'}>
                    {feedback.score}/100
                  </Badge>
                </div>
                <p>{feedback.feedback}</p>
              </Card.Body>
            </Card>
            <div className="text-center">
              {currentQuestion < sessionData.questions.length - 1 ? (
                <Button onClick={nextQuestion}>Next Question</Button>
              ) : (
                <Button onClick={nextQuestion} variant="success">Complete Interview</Button>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  if (step === 'complete') {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Body className="text-center">
                <h3>Interview Complete! 🎉</h3>
                <p>Great job completing your interview session.</p>
                <Button href="/dashboard">View Dashboard</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
};

export default Interview;