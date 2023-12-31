import Joi from "joi";

const idRegex = /^[0-9a-fA-F]{24}$/;
const id = Joi.string().regex(idRegex)
const name = Joi.string();
const image = Joi.string().allow(null);

export const createBrandSchema = Joi.object({
    name: name.required()
})

export const updateBrandSchema = Joi.object({
    name,
    image
})

export const getBrandSchema = Joi.object({
    id: id.required()
})

export const queryBrandSchema = Joi.object({
    name
})