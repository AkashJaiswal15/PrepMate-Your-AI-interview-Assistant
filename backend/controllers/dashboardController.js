const Session = require('../models/Session');
const User = require('../models/User');

const getDashboard = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);

    const pinnedQuestions = await Session.aggregate([
      { $match: { userId: req.user._id } },
      { $unwind: '$questions' },
      { $match: { 'questions.pinned': true } },
      { $project: {
        question: '$questions.text',
        answer: '$questions.userAnswer',
        feedback: '$questions.aiFeedback',
        date: '$createdAt'
      }},
      { $sort: { date: -1 } },
      { $limit: 5 }
    ]);

    const stats = await Session.aggregate([
      { $match: { userId: req.user._id } },
      { $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        avgScore: { $avg: { $ifNull: ['$score', 0] } },
        totalQuestions: { $sum: { $size: '$questions' } }
      }}
    ]);

    res.json({
      sessions,
      pinnedQuestions,
      stats: stats[0] || { totalSessions: 0, avgScore: 0, totalQuestions: 0 }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session || session.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboard, getSession };