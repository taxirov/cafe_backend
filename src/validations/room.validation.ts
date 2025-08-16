import Joi from 'joi';

export const roomValidationSchema = Joi.object({
    name: Joi.string().required(),
    desc: Joi.string(),
    capacity: Joi.number().required()
  })
