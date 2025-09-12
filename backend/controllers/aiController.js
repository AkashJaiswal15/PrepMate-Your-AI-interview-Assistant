const Groq = require('groq-sdk');
const { findUserById, updateUser, sessions } = require('../utils/fileStorage');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Mock questions database
const mockQuestions = {
  general: {
    easy: [
      "Tell me about yourself and your background.",
      "What are your greatest strengths?",
      "Why are you interested in this position?",
      "Where do you see yourself in 5 years?",
      "What motivates you at work?"
    ],
    medium: [
      "Describe a challenging project you worked on.",
      "How do you handle tight deadlines?",
      "Tell me about a time you had to learn something new quickly.",
      "How do you prioritize tasks when everything seems urgent?",
      "Describe a situation where you had to work with a difficult team member."
    ],
    hard: [
      "Tell me about a time you failed and what you learned from it.",
      "How would you handle a situation where you disagree with your manager?",
      "Describe the most complex problem you've solved.",
      "How do you stay updated with industry trends?",
      "What would you do if you discovered a major flaw in a project just before launch?"
    ]
  },
  frontend: {
    easy: [
      "What is the difference between HTML, CSS, and JavaScript?",
      "Explain what responsive design means.",
      "What are the benefits of using CSS frameworks?",
      "How do you optimize website loading speed?",
      "What is the DOM?"
    ],
    medium: [
      "Explain the difference between var, let, and const in JavaScript.",
      "How do you handle cross-browser compatibility?",
      "What are JavaScript closures?",
      "Explain the concept of virtual DOM.",
      "How do you implement state management in React?"
    ],
    hard: [
      "Explain how JavaScript event loop works.",
      "What are the differences between server-side and client-side rendering?",
      "How would you optimize a React application for performance?",
      "Explain webpack and its role in modern frontend development.",
      "How do you implement progressive web app features?"
    ]
  }
};

const generateQuestions = async (req, res) => {
  try {
    const { role = 'general', difficulty = 'medium' } = req.body;
    const user = findUserById(req.user._id);
    
    let questions = mockQuestions[role]?.[difficulty] || mockQuestions.general[difficulty];
    
    const session = {
      _id: Date.now().toString(),
      userId: req.user._id,
      role,
      questions: questions.map(q => ({ text: q, difficulty })),
      createdAt: new Date()
    };
    
    sessions.push(session);
    
    const userSessions = user.sessions || [];
    userSessions.push(session._id);
    updateUser(req.user._id, { sessions: userSessions });

    res.json({ sessionId: session._id, questions });
  } catch (error) {
    console.error('AI Error:', error);
    const { role = 'general', difficulty = 'medium' } = req.body;
    const questions = mockQuestions[role]?.[difficulty] || mockQuestions.general[difficulty];
    
    const session = {
      _id: Date.now().toString(),
      userId: req.user._id,
      role,
      questions: questions.map(q => ({ text: q, difficulty })),
      createdAt: new Date()
    };
    
    sessions.push(session);

    res.json({ sessionId: session._id, questions });
  }
};

const submitAnswer = async (req, res) => {
  try {
    const { sessionId, questionIndex, answer } = req.body;
    
    const session = sessions.find(s => s._id === sessionId);
    if (!session || session.userId !== req.user._id) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const answerLength = answer.trim().length;
    const score = Math.min(100, Math.max(20, answerLength / 5 + Math.random() * 30));
    
    const feedbackTemplates = [
      "Good answer! You demonstrated clear understanding. Consider adding more specific examples.",
      "Well structured response. Your explanation shows good knowledge of the topic.",
      "Nice approach to the question. You could enhance your answer with more technical details.",
      "Solid answer with good reasoning. Try to be more concise in your explanations.",
      "Great insights! Your answer shows practical experience. Consider mentioning potential challenges."
    ];
    
    const feedback = feedbackTemplates[Math.floor(Math.random() * feedbackTemplates.length)];
    
    session.questions[questionIndex].userAnswer = answer;
    session.questions[questionIndex].aiFeedback = feedback;

    res.json({ score: Math.round(score), feedback });
  } catch (error) {
    console.error('AI Evaluation Error:', error);
    res.status(500).json({ message: error.message });
  }
};

const togglePin = async (req, res) => {
  try {
    const { sessionId, questionIndex } = req.body;
    
    const session = sessions.find(s => s._id === sessionId);
    if (!session || session.userId !== req.user._id) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.questions[questionIndex].pinned = !session.questions[questionIndex].pinned;

    res.json({ pinned: session.questions[questionIndex].pinned });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateQuestions, submitAnswer, togglePin };