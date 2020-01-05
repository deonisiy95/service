const mongoose = require('mongoose');
const bCrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {secret} = require('../../config').jwt;
const authHelper = require('../helpers/authHelper');

const User = mongoose.model('User');
const Token = mongoose.model('Token');

const updateToken = userId => {
  const accessToken = authHelper.generateAccessToken(userId);
  const refreshToken = authHelper.generateRefreshToken();

  return authHelper.replaceDbRefreshToken(refreshToken.id, userId).then(() => ({
    accessToken,
    refreshToken: refreshToken.token
  }));
};

const refreshToken = (req, res) => {
  const {refreshToken} = req.body;
  let payload;
  try {
    payload = jwt.verify(refreshToken, secret);
    if (payload.type !== 'refresh') {
      res.status(400).json({message: 'Invalid token!'});
      return;
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(400).json({message: 'Token expired!'});
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(400).json({message: 'Invalid token!'});
    }
  }

  Token.findOne({tokenId: payload.id})
    .exec()
    .then(token => {
      if (token === null) {
        throw new Error('Invalid token!');
      }

      return updateToken(token.userId);
    })
    .then(tokens => res.json(tokens))
    .catch(error => res.status(400).json({message: error.message}));
};

const singIn = (req, res) => {
  if (!req.body) {
    res.status(400).json({message: 'Invalid params'});
  }
  const {email, password} = req.body;
  User.findOne({email})
    .exec()
    .then(user => {
      if (!user) {
        res.status(401).json({message: 'User does not exist!'});
      }
      const isValid = bCrypt.compareSync(password, user.password);
      if (isValid) {
        updateToken(user._id).then(tokens => res.json({tokens}));
        return;
      }
      res.status(401).json({message: 'Invalid credentials!'});
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({message: error.message});
    });
};

const singUp = (req, res) => {
  if (!req.body) {
    res.status(400).json({message: 'Invalid params'});
    return;
  }

  const {name, email, password} = req.body;
  if (!name || !email || !password) {
    res.status(400).json({message: 'Invalid params'});
    return;
  }

  User.findOne({email}).then(user => {
    if (user) {
      res.status(401).json({message: 'User exist!'});
      return;
    }

    const hash = bCrypt.hashSync(password, 10);
    User.create({
      name,
      email,
      password: hash
    })
      .then(user => updateToken(user._id))
      .then(tokens => res.json({tokens}));
  });
};

module.exports = {
  singIn,
  singUp,
  refreshToken
};
