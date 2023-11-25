import Joi from "joi";

export const userValidationSchemaRegister = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    salary: Joi.number().required(),
    role_id: Joi.number().required(),
    phone: Joi.string().required(),
    email: Joi.string().required(),
    joined_date: Joi.string().required()
})

export const userValidationSchemaLogin = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})