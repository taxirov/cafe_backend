import Joi from 'joi';

 export const productBodySchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    category_id: Joi.number().required(),
    desc: Joi.string().required()
})
