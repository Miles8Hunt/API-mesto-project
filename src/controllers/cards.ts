import { Request, Response } from 'express';
import { ObjectId, Error } from 'mongoose';
import { UserRequest } from '../types/types';
import cardModel from '../models/card';
import NotFoundError from '../errors/notFound';

export const getCards = (req: Request, res: Response) => {
  cardModel
    .find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера (getCards)' }));
};

export const createCard = (req: UserRequest, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user?._id;

  cardModel
    .create({ name, link, owner })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера (createCard)' });
      }
    });
};

export const deleteCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;

  cardModel
    .findByIdAndDelete(cardId)
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err instanceof Error.CastError) {
        res.status(404).send('Карточка с указанным _id не найдена');
      } else {
        res.status(500).send({ message: 'Ошибка сервера (deleteCard)' });
      }
    });
};

export const likeCard = (req: UserRequest, res: Response) => {
  const { cardId } = req.params;

  cardModel
    .findByIdAndUpdate(cardId, { $addToSet: { likes: req.user?._id } }, { new: true })

    .orFail(() => new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => res.status(200).send({ data: card }))

    .catch((err) => {
      if (err instanceof Error.CastError) {
        res.status(404).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера (likeCard)' });
      }
    });
};

export const dislikeCard = (req: UserRequest, res: Response) => {
  const userId = req.user?._id;
  const { cardId } = req.params;

  cardModel
    .findByIdAndUpdate(cardId, { $pull: { likes: userId as unknown as ObjectId } }, { new: true })

    .orFail(() => new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => res.status(200).send({ data: card }))

    .catch((err) => {
      if (err instanceof Error.CastError) {
        res.status(404).send({ message: 'Переданы некорректные данные для снятии лайка' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера (dislikeCard)' });
      }
    });
};
