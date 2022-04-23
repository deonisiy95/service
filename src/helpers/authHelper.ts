import * as jwt from 'jsonwebtoken';
import {v4 as uuid} from 'uuid';
import mongoose from 'mongoose';
import config from '../../config';

const Token = mongoose.model('Token');

const generateAccessToken = (userId: number) => {
  const payload = {
    userId,
    type: config.jwt.tokens.access.type
  };
  const options = {
    expiresIn: config.jwt.tokens.access.expiresIn
  };

  return jwt.sign(payload, config.jwt.secret, options);
};

const generateRefreshToken = () => {
  const payload = {
    id: uuid(),
    type: config.jwt.tokens.refresh.type
  };
  const options = {
    expiresIn: config.jwt.tokens.refresh.expiresIn
  };

  return {
    id: payload.id,
    token: jwt.sign(payload, config.jwt.secret, options)
  };
};

const replaceDbRefreshToken = (tokenId: string, userId: number) =>
  Token.findOneAndRemove({userId})
    .exec()
    .then(() => Token.create({tokenId, userId}));

export default {
  generateAccessToken,
  generateRefreshToken,
  replaceDbRefreshToken
}
