const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  questions: [{
    text: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    userAnswer: { type: String },
    aiFeedback: { type: String },
    pinned: { type: Boolean, default: false }
  }],
  role: { type: String, default: 'general' },
  score: { type: Number, min: 0, max: 100 }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);