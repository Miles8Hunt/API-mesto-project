import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IAuth } from '../types/types';
import UnauthorizedError from '../errors/unauthorized';
import JWT_SECRET_KEY from '../constansts/jwt-secret-key';

export default (req: IAuth, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходимо авторизоваться'));
  }

  const token = authorization?.replace('Bearer ', '');
  let payload;

  try {
    if (token) {
      payload = jwt.verify(token, JWT_SECRET_KEY);
    }
  } catch (err) {
    next(err);
  }

  req.user = payload as { _id: JwtPayload };

  next();
};
