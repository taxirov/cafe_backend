import Joi from 'joi';

export const orderPostSchema = Joi.object({
    title: Joi.string().required(),
    desc: Joi.string().allow(null),
    room_id: Joi.number().required().allow(null)
})

export const orderPutSchema = Joi.object({
    title: Joi.string().required(),
    desc: Joi.string().allow(null),
    room_id: Joi.number().required().allow(null),
    user_id: Joi.number().required()
})