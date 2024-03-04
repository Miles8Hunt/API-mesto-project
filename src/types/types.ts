import { Request } from 'express';
import { Schema } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';

export interface UserRequest extends Request {
  user?: {
    _id: string;
  }
}

export type TypesError = {
  statusCode: number;
  message: string;
};

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

export interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  createdAt: Schema.Types.Date;
}

export interface IAuth extends Request {
  user?: string | JwtPayload;
}
