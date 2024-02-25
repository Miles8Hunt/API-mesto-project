import { Response, NextFunction } from 'express';
import { UserRequest, TypesError } from '../types/types';

const HTTP_INTERNAL_ERROR = 500;

export default (err: TypesError, req: UserRequest, res: Response, next: NextFunction) => {
  const { statusCode = HTTP_INTERNAL_ERROR, message } = err;
  res.status(statusCode).send({
    message: statusCode === HTTP_INTERNAL_ERROR ? 'Ошибка сервера' : message,
  });
  next();
};
