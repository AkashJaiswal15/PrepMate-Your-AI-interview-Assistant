const jwt = require('jsonwebtoken');
const { findUserById } = require('../utils/fileStorage');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('🔑 Token received:', token ? 'Present' : 'Missing');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔓 Token decoded, user ID:', decoded.id);
    
    const user = findUserById(decoded.id);
    console.log('👤 User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token - user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('🚫 Auth error:', error.message);
    res.status(401).json({ message: 'Invalid token - ' + error.message });
  }
};

module.exports = auth;