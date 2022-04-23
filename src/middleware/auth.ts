import * as jwt from 'jsonwebtoken';
import config from '../../config';
import {TRequest, TResponse} from 'src/@types/global';

interface IPayload {
  type: string;
  userId: number;
}

export default (req: TRequest<unknown>, res: TResponse<unknown>, next: Function) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    res.status(401).json({message: 'token_not_provided'});
    return;
  }
  try {
    const payload = jwt.verify(authHeader, config.jwt.secret) as IPayload;
    if (payload.type !== 'access') {
      res.status(401).json({message: 'invalid_token'});
      return;
    }
    if (payload.userId) {
      req.userId = payload.userId;
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({message: 'token_expired'});
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({message: 'invalid_token'});
      return;
    }
  }

  next();
};
