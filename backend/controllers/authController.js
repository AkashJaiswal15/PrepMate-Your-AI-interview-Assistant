const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { findUserByEmail, createUser } = require('../utils/fileStorage');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = createUser({ name, email, password: hashedPassword });
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    let user = findUserByEmail(email);
    
    // If user doesn't exist, create a user with email as name for demo
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 12);
      const userName = email.split('@')[0]; // Use email prefix as name
      user = createUser({ 
        name: userName, 
        email: email, 
        password: hashedPassword,
        skills: ['javascript', 'react', 'node.js']
      });
    } else {
      // Check password for existing user
      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    }

    const token = generateToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };