import Joi from "joi";

const idRegex = /^[0-9a-fA-F]{24}$/;

const positiveQuestion = Joi.string().min(3).max(150);
const negativeQuestion = Joi.string().allow(null);
const multipleSelection = Joi.boolean();
const starToDisplayPositive = Joi.number().min(1).max(5);
const brandId = Joi.string().regex(idRegex);
const id = Joi.string().regex(idRegex)

export const createQuestionSchema = Joi.object({
  positiveQuestion: positiveQuestion.required(),
  negativeQuestion: negativeQuestion.required(),
  multipleSelection: multipleSelection.required(),
  starToDisplayPositive: starToDisplayPositive.required(),
  brandId: brandId.required(),
});

export const updateQuestionSchema = Joi.object({
    positiveQuestion,
    negativeQuestion,
    multipleSelection,
    starToDisplayPositive,
    brandId,
})

export const getQuestionSchema = Joi.object({
    id: id.required()
})

export const getAllQuestionSchema = Joi.object({
    brandId: brandId.required()
})

