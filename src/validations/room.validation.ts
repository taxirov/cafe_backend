import Joi from 'joi';

export const roomValidationSchema = Joi.object({
    name: Joi.string().required(),
    desc: Joi.string().required(),
    capacity: Joi.number().integer().required(),
    booked: Joi.boolean(),
    image: Joi.string().allow(null),
  })