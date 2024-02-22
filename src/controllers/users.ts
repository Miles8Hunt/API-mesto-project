import { Request, Response } from 'express';
import { Error } from 'mongoose';
import userModel from '../models/user';
import { UserRequest } from '../types/types';
import NotFoundError from '../errors/notFound';

export const getUsers = (req: Request, res: Response) => {
  userModel
    .find()
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера (getUsers)' }));
};

export const getUserById = (req: Request, res: Response) => {
  const { userId } = req.params;

  userModel
    .findById(userId)
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err instanceof Error.CastError) {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера (getUserById)' });
      }
    });
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  userModel
    .create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера (createUser)' });
      }
    });
};

export const updateUserInfo = (req: UserRequest, res: Response) => {
  const { name, about } = req.body;
  const userId = req.user?._id;

  userModel
    .findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })

    .orFail(() => new NotFoundError('Пользователь с указанным _id не найден'))
    .then((user) => res.status(200).send({ data: user }))

    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера (updateUserInfo)' });
      }
    });
};

export const updateUserAvatar = (req: UserRequest, res: Response) => {
  const { avatar } = req.body;
  const userId = req.user?._id;

  userModel
    .findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })

    .orFail(() => new NotFoundError('Пользователь с указанным _id не найден'))
    .then((user) => res.status(200).send({ data: user }))

    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера (updateUserAvatar)' });
      }
    });
};
