import { Joi, celebrate, Segments } from 'celebrate';
import customMethod from './validationsMethod';

const createCardValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().custom(customMethod.isUrlMethod).required(),
  }),
});

const deleteCardValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

const likeCardValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

const dislikeCardValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

export default {
  createCardValidation,
  deleteCardValidation,
  likeCardValidation,
  dislikeCardValidation,
};
