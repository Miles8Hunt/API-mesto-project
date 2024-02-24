import { Router, Response, NextFunction } from 'express';
import usersRouter from './users';
import cardsRouter from './cards';
import { UserRequest } from '../types/types';
import NotFoundError from '../errors/notFound';

const router = Router();

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use((req: UserRequest, res:Response, next: NextFunction) => {
  next(new NotFoundError('Страницы не существует'));
});

export default router;
