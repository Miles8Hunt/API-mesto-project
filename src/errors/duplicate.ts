import { Error } from 'mongoose';
import HTTP_STATUS from '../constansts/status-codes';

class DuplicateError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS.DUPLICATE_ERROR;
  }
}

export default DuplicateError;
