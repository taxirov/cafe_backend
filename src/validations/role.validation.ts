import Joi from 'joi';

export const roleBodySchema = Joi.object({
    name: Joi.string().required()
  })