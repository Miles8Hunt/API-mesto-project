import { Router } from 'express';
import { getUsers, getUserInfo, getUserById, updateUserInfo, updateUserAvatar } from '../controllers/users';
import userRequest from '../middlewares/validation/userRequestValidation';

const usersRouter = Router();

usersRouter.get('/', getUsers);
usersRouter.get('/me', getUserInfo);
usersRouter.get('/:userId', userRequest.getUserByIdValidation, getUserById);
usersRouter.patch('/me', userRequest.updateUserInfoValidation, updateUserInfo);
usersRouter.patch('/me/avatar', userRequest.updateUserAvatarValidation, updateUserAvatar);

export default usersRouter;
