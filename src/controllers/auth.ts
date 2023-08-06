import jwt, {JwtPayload} from 'jsonwebtoken';
import bCrypt from 'bcrypt';
import config from '../../config';
import authHelper from 'src/helpers/authHelper';
import Token from 'src/models/token';
import User from 'src/models/user';
import {NSAuth} from 'src/@types/auth';
import {TRequest, TResponse} from 'src/@types/global';
import {logger} from 'src/helpers/logger';

const updateToken = (userId: number) => {
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
    payload = jwt.verify(refreshToken, config.jwt.secret) as JwtPayload;
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
    return;
  }

  Token.findOne({tokenId: payload.id})
    .exec()
    .then(token => {
      if (token === null) {
        throw new Error('Invalid token!');
      }

      return updateToken(token.userId);
    })
    .then(tokens => res.json({tokens}))
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
        res.status(401).json({message: 'invalid_credentials'});

        // log user_does_not_exist
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
      logger.error(error);
      res.status(500).json({message: error.message});
    });
};

const logout = (req: TRequest<{}>, res: TResponse<{}>) => {
  Token.findOneAndRemove({userId: req.userId})
    .exec()
    .then(() => res.json({ok: true}))
    .catch(e => res.status(500).json({message: 'Something is wrong!'}));
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
  refreshToken,
  logout
};
