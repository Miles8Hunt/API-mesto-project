import { Error } from 'mongoose';

const HTTP_NOT_FOUND_ERROR = 404;

class NotFoundError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_NOT_FOUND_ERROR;
  }
}

export default NotFoundError;
