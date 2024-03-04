import { Request, Response, NextFunction } from 'express';
import { ObjectId, Error } from 'mongoose';
import { UserRequest } from '../types/types';
import cardModel from '../models/card';
import NotFoundError from '../errors/notFound';
import BadRequestError from '../errors/badRequest';
import ForbiddenError from '../errors/forbidden';
import HTTP_STATUS from '../constansts/status-codes';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  cardModel
    .find({})
    .then((cards) => res.status(HTTP_STATUS.OK).send({ data: cards }))
    .catch((err) => next(err));
};

export const createCard = (req: UserRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user?._id;

  cardModel
    .create({ name, link, owner })
    .then((card) => res.status(HTTP_STATUS.OK).send({ data: card }))
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

export const deleteCard = async (req: UserRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  try {
    const card = await cardModel
      .findById(cardId)
      .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'));

    if (card.owner.toString() !== userId) {
      throw new ForbiddenError('Нельзя удалить чужую карточку');
    }
    await card.deleteOne();

    res.status(HTTP_STATUS.OK).send({ data: card });
  } catch (err) {
    if (err instanceof Error.CastError) {
      next(new BadRequestError('Переданы некорректные данные карточки (невалидный ID)'));
    } else {
      next(err);
    }
  }
};

const cardLikes = (req: UserRequest, res: Response, next: NextFunction, like: any) => {
  const { cardId } = req.params;

  cardModel
    .findByIdAndUpdate(cardId, like, { new: true })

    .orFail(() => new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => res.status(HTTP_STATUS.OK).send({ data: card }))

    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные для постановки / снятии лайка'));
      } else {
        next(err);
      }
    });
};

export const likeCard = (req: UserRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const putLike = { $addToSet: { likes: userId } };
  cardLikes(req, res, next, putLike);
};

export const dislikeCard = (req: UserRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const removeLike = { $pull: { likes: userId as unknown as ObjectId } };
  cardLikes(req, res, next, removeLike);
};
