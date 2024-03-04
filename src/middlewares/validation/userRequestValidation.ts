import { Joi, celebrate, Segments } from 'celebrate';
import customMethod from './validationsMethod';

const getUserByIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

const createUserValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().custom(customMethod.isUrlMethod),
    email: Joi.string().custom(customMethod.isEmailMethod).required(),
    password: Joi.string().min(8).required(),
  }),
});

const loginValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().custom(customMethod.isEmailMethod).required(),
    password: Joi.string().min(8).required(),
  }),
});

const updateUserInfoValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
  }),
});

const updateUserAvatarValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().custom(customMethod.isUrlMethod).required(),
  }),
});

export default {
  getUserByIdValidation,
  createUserValidation,
  loginValidation,
  updateUserInfoValidation,
  updateUserAvatarValidation,
};
