import Joi from "joi";

const idRegex = /^[0-9a-fA-F]{24}$/;
const id = Joi.string().regex(idRegex)
const name = Joi.string();
const description = Joi.string();
const validDays = Joi.number().min(1).max(30)
const questionnaireId = Joi.string().regex(idRegex);

export const createGiftSchema = Joi.object({
    name: name.required(),
    description: description.required(),
    validDays: validDays.required(),
    questionnaireId: questionnaireId.required()
})

export const updateGiftSchema = Joi.object({
    name, 
    description, 
    validDays
})

export const getGiftSchema = Joi.object({
    id: id.required()
})

export const getAllGiftSchema = Joi.object({
    questionnaireId: questionnaireId.required()
})