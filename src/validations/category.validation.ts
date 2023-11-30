import Joi from 'joi';

export const categoryPostSchema = Joi.object({
    name: Joi.string().required(),
    desc: Joi.string().required()
})

export const categoryPutSchema = Joi.object({
    name: Joi.string().required(),
    desc: Joi.string().required()
})