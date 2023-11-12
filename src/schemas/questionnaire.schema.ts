import Joi from "joi";

const idRegex = /^[0-9a-fA-F]{24}$/;

const id = Joi.string().regex(idRegex)
const brandId = Joi.string().regex(idRegex)
const name = Joi.string().min(1).max(50)
const questionChains = Joi.array()
const answeredQuestionnaire = Joi.object()

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

export const addQuestionChainsSchema = Joi.object({
    questionChains: questionChains.required()
})

export const createStatisticsSchema = Joi.object({
    brandId: brandId.required(),
    questionnaireId: id.required(),
    answeredQuestionnaire: answeredQuestionnaire.required() 
})

export const queryQuestionnaireIdSchema = Joi.object({
    id
})