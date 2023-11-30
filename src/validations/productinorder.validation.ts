import Joi from 'joi';

 export const prInOrValidationSchema = Joi.object({
    order_id: Joi.number().required(),
    product_id: Joi.number().required(),
    count: Joi.number().required(),
    created_date: Joi.string().required()
})

export const prInOrPutValidationSchema = Joi.object({
    order_id: Joi.number().required(),
    product_id: Joi.number().required(),
    count: Joi.number().required(),
    user_id: Joi.number().required()
})
