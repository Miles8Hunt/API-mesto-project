import { Error } from 'mongoose';
import HTTP_STATUS from '../constansts/status-codes';

class BadRequestError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS.BAD_REQUEST_ERROR;
  }
}

export default BadRequestError;
