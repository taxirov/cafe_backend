import Joi from 'joi';

export const categoryValidationSchema = Joi.object({
    room_id: Joi.number().integer().required(),
    user_id: Joi.number().integer().required(),
    price: Joi.number().integer().required(),
    person: Joi.number().integer().required(),
    booker: Joi.string().required(),
    desc: Joi.string(),
    status: Joi.boolean().required(),
})