import Joi from "joi";

const idRegex = /^[0-9a-fA-F]{24}$/;

const id = Joi.string().regex(idRegex)
const brandId = Joi.string().regex(idRegex)
const name = Joi.string().min(1).max(50)

export const createQuestionnaireSchema = Joi.object({
    name: name.required(),
    brandId: brandId.required()
})

export const updateQuestionnaireSchema = Joi.object({
    name
})

export const getQuestionnaireSchema = Joi.object({
    id: id.required()
})

export const getAllQuestionnaireSchema = Joi.object({
    brandId: brandId.required()
})