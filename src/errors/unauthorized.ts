import { Error } from 'mongoose';
import HTTP_STATUS from '../constansts/status-codes';

class UnauthorizedError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS.UNAUTHORIZEN_ERROR;
  }
}

export default UnauthorizedError;
