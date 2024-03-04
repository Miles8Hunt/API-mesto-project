import { Response, NextFunction } from 'express';
import { UserRequest, TypesError } from '../types/types';
import HTTP_STATUS from '../constansts/status-codes';

export default (err: TypesError, req: UserRequest, res: Response, next: NextFunction) => {
  const { statusCode = HTTP_STATUS.INTERNAL_ERROR, message } = err;
  res.status(statusCode).send({
    message: statusCode === HTTP_STATUS.INTERNAL_ERROR ? 'Ошибка сервера' : message,
  });
  next();
};
