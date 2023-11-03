import Joi from 'joi';

 export const categoryValidationSchema = Joi.object({
    user_id: Joi.number().integer().required(),
    order_id: Joi.number().integer().required(),
    product_id: Joi.number().integer().required(),
})
