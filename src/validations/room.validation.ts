import Joi from 'joi';

export const orderValidationSchema = Joi.object({
    name: Joi.string().required(),
    desc: Joi.string().required(),
    capacity: Joi.number().integer().required(),
    booked: Joi.boolean().required(),
  })