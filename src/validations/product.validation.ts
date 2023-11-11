import Joi from 'joi';

 export const productBodyValidationSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    category_id: Joi.number().required(),
    desc: Joi.string().required()
})

export const productQueryValidationSchema = Joi.object({
    category_id: Joi.number()
})

export const productParamsValidationSchema = Joi.object({
    id: Joi.number()
})
