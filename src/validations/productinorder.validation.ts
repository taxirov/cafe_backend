import Joi from 'joi';

 export const prInOrValidationSchema = Joi.object({
    order_id: Joi.number().required(),
    product_id: Joi.number().required(),
    count: Joi.number().required()
})

export const prInOrPutValidationSchema = Joi.object({
    product_id: Joi.number().required(),
    count: Joi.number().required(),
})
