import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUserInfo, updateUserAvatar } from '../controllers/users';

const usersRouter = Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUserById);
usersRouter.post('/', createUser);
usersRouter.patch('/me', updateUserInfo);
usersRouter.patch('/me/avatar', updateUserAvatar);

export default usersRouter;
