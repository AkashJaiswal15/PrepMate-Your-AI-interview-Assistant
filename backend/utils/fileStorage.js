// Simple file-based storage for demo purposes
let users = [];
let sessions = [];

const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

const createUser = (userData) => {
  const user = {
    _id: Date.now().toString(),
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  users.push(user);
  return user;
};

const findUserById = (id) => {
  let user = users.find(user => user._id === id);
  // If user not found, create a temporary user for demo
  if (!user) {
    user = {
      _id: id,
      name: 'User' + id.toString().slice(-4), // Use last 4 chars of ID as name
      email: 'user@example.com',
      skills: ['javascript', 'react', 'node.js'],
      createdAt: new Date()
    };
    users.push(user);
  }
  return user;
};

const updateUser = (id, updateData) => {
  const userIndex = users.findIndex(user => user._id === id);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updateData, updatedAt: new Date() };
    return users[userIndex];
  }
  return null;
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
  updateUser,
  users,
  sessions
};