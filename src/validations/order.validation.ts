import Joi from 'joi';

export const orderValidationSchema = Joi.object({
    title: Joi.string().required(),
    desc: Joi.string().allow(null),
    room_id: Joi.number().required(),
    created_date: Joi.string().required()
})