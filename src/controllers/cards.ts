import { Request, Response, NextFunction } from 'express';
import { ObjectId, Error } from 'mongoose';
import { UserRequest } from '../types/types';
import cardModel from '../models/card';
import NotFoundError from '../errors/notFound';
import BadRequestError from '../errors/badRequest';
import HTTP_STATUS_OK from '../constansts/status-codes';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  cardModel
    .find({})
    .then((cards) => res.status(HTTP_STATUS_OK).send({ data: cards }))
    .catch((err) => next(err));
};

export const createCard = (req: UserRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user?._id;

  cardModel
    .create({ name, link, owner })
    .then((card) => res.status(HTTP_STATUS_OK).send({ data: card }))
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  cardModel
    .findByIdAndDelete(cardId)
    .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'))
    .then((card) => res.status(HTTP_STATUS_OK).send({ data: card }))
    .catch((err) => next(err));
};

export const likeCard = async (req: UserRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  cardModel
    .findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })

    .orFail(() => new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => res.status(HTTP_STATUS_OK).send({ data: card }))

    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      } else {
        next(err);
      }
    });
};

export const dislikeCard = (req: UserRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  cardModel
    .findByIdAndUpdate(cardId, { $pull: { likes: userId as unknown as ObjectId } }, { new: true })

    .orFail(() => new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => res.status(HTTP_STATUS_OK).send({ data: card }))

    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные для снятии лайка'));
      } else {
        next(err);
      }
    });
};
