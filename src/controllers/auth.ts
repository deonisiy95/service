import bCrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';
import {NSAuth} from '../@types/auth';
import authHelper from '../helpers/authHelper';
import Token from '../models/token';
import User from '../models/user';

const updateToken = userId => {
  const accessToken = authHelper.generateAccessToken(userId);
  const refreshToken = authHelper.generateRefreshToken();

  return authHelper.replaceDbRefreshToken(refreshToken.id, userId).then(() => ({
    accessToken,
    refreshToken: refreshToken.token
  }));
};

const refreshToken = (req: NSAuth.TAuthRequest, res: NSAuth.TAuthResponse) => {
  const {refreshToken} = req.body;
  let payload;

  try {
    payload = jwt.verify(refreshToken, config.jwt.secret);
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

const singIn = (req: NSAuth.TSignInRequest, res: NSAuth.TSignInResponse) => {
  if (!req.body || !req.body.email || !req.body.password) {
    res.status(400).json({message: 'invalid_params'});
    return;
  }

  const {email, password} = req.body;
  User.findOne({email})
    .then(user => {
      if (!user) {
        res.status(401).json({message: 'user_does_not_exist'});
        return;
      }

      const isValid = bCrypt.compareSync(password, user.password);
      if (isValid) {
        updateToken(user._id).then(tokens => res.json({tokens}));
        return;
      }
      res.status(401).json({message: 'invalid_credentials'});
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({message: error.message});
    });
};

const singUp = (req: NSAuth.TSignUpRequest, res: NSAuth.TSignUpResponse) => {
  if (!req.body) {
    res.status(400).json({message: 'invalid_params'});
    return;
  }

  const {name, email, password} = req.body;
  if (!name || !email || !password) {
    res.status(400).json({message: 'invalid_params'});
    return;
  }

  User.findOne({email}).then(user => {
    if (user) {
      res.status(401).json({message: 'user_exist'});
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

export default {
  singIn,
  singUp,
  refreshToken
};
