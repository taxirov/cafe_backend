import Joi from 'joi';

export const orderValidationSchema = Joi.object({
    title: Joi.string().required(),
    desc: Joi.string().allow(null),
    user_id: Joi.number().required(),
    room_id: Joi.number().required(),
    total_price: Joi.number().allow(null)
})