import { Response, NextFunction } from 'express';
import { UserRequest, TypesError } from '../types/types';

export default (err: TypesError, req: UserRequest, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Ошибка сервера' : message,
  });
  next();
};
