import { Router } from 'express';
import { getCards, createCard, deleteCard, likeCard, dislikeCard } from '../controllers/cards';
import cardRequest from '../middlewares/validation/cardRequestValidation';

const cardsRouter = Router();

cardsRouter.get('/', getCards);
cardsRouter.post('/', cardRequest.createCardValidation, createCard);
cardsRouter.delete('/:cardId', cardRequest.deleteCardValidation, deleteCard);
cardsRouter.put('/:cardId/likes', cardRequest.likeCardValidation, likeCard);
cardsRouter.delete('/:cardId/likes', cardRequest.dislikeCardValidation, dislikeCard);

export default cardsRouter;
