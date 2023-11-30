import Joi from 'joi';

export const productPostSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    category_id: Joi.number().required(),
    desc: Joi.string().required()
})

export const productPutSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    category_id: Joi.number().required(),
    desc: Joi.string().required()
})

export const productGetSchema = Joi.object({
    category_id: Joi.number().allow('')
})
