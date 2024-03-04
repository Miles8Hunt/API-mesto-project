import { Request, Response, NextFunction } from 'express';
import { Error } from 'mongoose';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/user';
import { UserRequest } from '../types/types';
import NotFoundError from '../errors/notFound';
import BadRequestError from '../errors/badRequest';
import UnauthorizedError from '../errors/unauthorized';
import DuplicateError from '../errors/duplicate';
import HTTP_STATUS from '../constansts/status-codes';
import JWT_SECRET_KEY from '../constansts/jwt-secret-key';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  userModel
    .find()
    .then((users) => res.status(HTTP_STATUS.OK).send({ data: users }))
    .catch((err) => next(err));
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  userModel
    .findById(userId)
    .orFail(() => new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => res.status(HTTP_STATUS.OK).send({ data: user }))
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные пользователя (невалидный ID)'));
      } else {
        next(err);
      }
    });
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;

  bcryptjs
    .hash(password, 10)
    .then((hash) => userModel.create({ name, about, avatar, password: hash, email }))
    .then((user) => {
      res.status(HTTP_STATUS.CREATED_SUCCESS).send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new DuplicateError('Пользователь с таким email уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  userModel
    .findOne({ email })
    .select('+password')
    .orFail(() => new UnauthorizedError('Неверные почта или пароль'))
    .then((user) => {
      bcryptjs.compare(password, user.password).then((matched) => {
        if (!matched) {
          return next(new UnauthorizedError('Неверные почта или пароль'));
        }
        const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET_KEY, { expiresIn: '7d' });

        res.cookie('jwt', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: true });
        res.status(HTTP_STATUS.OK).send({ token, name: user.name, email: user.email });
      });
    })
    .catch((err) => next(err));
};

export const getUserInfo = async (req: UserRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  userModel
    .findById(userId)
    .orFail(() => new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => res.status(HTTP_STATUS.OK).send({ data: user }))
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные пользователя (невалидный ID)'));
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
    .then((user) => res.status(HTTP_STATUS.OK).send({ data: user }))

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
