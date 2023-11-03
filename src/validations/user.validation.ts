import Joi from "joi";

export const userValidationSchemaRegister = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    salary: Joi.number().required(),
    role: Joi.string().required(),
    phone: Joi.string().required()
})

export const userValidationSchemaLogin = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})