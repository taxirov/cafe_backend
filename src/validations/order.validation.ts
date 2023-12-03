import Joi, { ObjectSchema } from 'joi';

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

export const orderGetSchema = Joi.object({
    current_page: Joi.number().allow(null).allow(''),
    per_page: Joi.number().allow(null, ''),
    status_order: Joi.number().allow(null, ''),
    room_id: Joi.number().allow(null, ''),
    user_id: Joi.number().allow(null, '')
})