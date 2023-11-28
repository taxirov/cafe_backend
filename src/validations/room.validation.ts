import Joi from 'joi';

export const roomValidationSchema = Joi.object({
    name: Joi.string().required(),
    desc: Joi.string().required(),
    capacity: Joi.number().required(),
    created_date: Joi.string().required()
  })