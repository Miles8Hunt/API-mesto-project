import { Error } from 'mongoose';
import HTTP_STATUS from '../constansts/status-codes';

class ForbiddenError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS.FORBIDDEN_ERROR;
  }
}

export default ForbiddenError;
