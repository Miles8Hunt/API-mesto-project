import { Request, Response, NextFunction } from 'express';
import { Error } from 'mongoose';
import userModel from '../models/user';
import { UserRequest } from '../types/types';
import NotFoundError from '../errors/notFound';
import BadRequestError from '../errors/badRequest';
import HTTP_STATUS_OK from '../constansts/status-codes';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  userModel
    .find()
    .then((users) => res.status(HTTP_STATUS_OK).send({ data: users }))
    .catch((err) => next(err));
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  userModel
    .findById(userId)
    .orFail(() => new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные пользователя (невалидный ID)'));
      } else {
        next(err);
      }
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  userModel
    .create({ name, about, avatar })
    .then((user) => res.status(HTTP_STATUS_OK).send({ data: user }))
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

const updateUser = async (req: UserRequest, res: Response, next: NextFunction, data: any) => {
  const userId = req.user?._id;

  userModel
    .findByIdAndUpdate(userId, data, { new: true, runValidators: true })

    .orFail(() => new NotFoundError('Пользователь с указанным _id не найден'))
    .then((user) => res.status(HTTP_STATUS_OK).send({ data: user }))

    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

export const updateUserInfo = (req: UserRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  updateUser(req, res, next, { name, about });
};

export const updateUserAvatar = (req: UserRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  updateUser(req, res, next, { avatar });
};
