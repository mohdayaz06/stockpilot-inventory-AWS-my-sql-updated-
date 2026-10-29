const jwt = require('jsonwebtoken');

/**
 * Signs a JWT for a given user id.
 * The token payload intentionally stores only the user id -
 * fresh user data (role, name, etc.) is fetched from the DB on each
 * authenticated request rather than trusted from an old token.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

module.exports = generateToken;
