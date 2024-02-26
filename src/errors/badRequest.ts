import { Error } from 'mongoose';

const HTTP_BAD_REQUEST_ERROR = 400;

class BadRequestError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_BAD_REQUEST_ERROR;
  }
}

export default BadRequestError;
