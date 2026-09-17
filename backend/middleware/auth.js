const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const User = require('../models/User');

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('Authentication required. Please log in.');
      error.statusCode = 401;
      return next(error);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      const error = new Error('Invalid authentication token.');
      error.statusCode = 401;
      return next(error);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.jwtSecret);
    } catch (jwtErr) {
      const error = new Error(jwtErr.name === 'TokenExpiredError' ? 'Session expired. Please log in again.' : 'Invalid authentication token.');
      error.statusCode = 401;
      return next(error);
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      const error = new Error('User account no longer exists.');
      error.statusCode = 401;
      return next(error);
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email
    };

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { authenticate };
