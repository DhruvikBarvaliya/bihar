const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, config.JWT_SECRET, { expiresIn: '12h' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, config.JWT_SECRET);
};
