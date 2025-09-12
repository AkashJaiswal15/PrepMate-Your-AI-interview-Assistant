const { findUserById, sessions } = require('../utils/fileStorage');

const getDashboard = async (req, res) => {
  try {
    const user = findUserById(req.user._id);
    const userSessions = sessions.filter(s => s.userId === req.user._id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    // Get pinned questions
    const pinnedQuestions = [];
    userSessions.forEach(session => {
      session.questions.forEach(q => {
        if (q.pinned) {
          pinnedQuestions.push({
            question: q.text,
            answer: q.userAnswer,
            feedback: q.aiFeedback,
            date: session.createdAt
          });
        }
      });
    });

    // Calculate stats
    const totalSessions = userSessions.length;
    const totalQuestions = userSessions.reduce((sum, s) => sum + s.questions.length, 0);
    const sessionsWithScores = userSessions.filter(s => s.score);
    const avgScore = sessionsWithScores.length > 0 
      ? sessionsWithScores.reduce((sum, s) => sum + s.score, 0) / sessionsWithScores.length 
      : 0;

    res.json({
      sessions: userSessions,
      pinnedQuestions: pinnedQuestions.slice(0, 5),
      stats: { 
        totalSessions, 
        avgScore: Math.round(avgScore), 
        totalQuestions 
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSession = async (req, res) => {
  try {
    const session = sessions.find(s => s._id === req.params.id);
    
    if (!session || session.userId !== req.user._id) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboard, getSession };