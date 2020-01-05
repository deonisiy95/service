const jwt = require('jsonwebtoken');
const {secret} = require('../../config').jwt;

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    res.status(401).json({message: 'Token not provided'});
    return;
  }
  try {
    const payload = jwt.verify(authHeader, secret);
    if (payload.type !== 'access') {
      res.status(401).json({message: 'Invalid token!'});
      return;
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({message: 'Token expired!'});
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({message: 'Invalid token'});
      return;
    }
  }

  next();
};
