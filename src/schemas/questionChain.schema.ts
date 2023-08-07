import Joi from "joi";

const idRegex = /^[0-9a-fA-F]{24}$/;
const id = Joi.string().regex(idRegex)
const question = Joi.string().regex(idRegex);
const positiveOptions = Joi.array().items(Joi.string().regex(idRegex))
const negativeOptions = Joi.array().items(Joi.string().regex(idRegex)).allow(null)
const conditions = Joi.array().items(Joi.string().regex(idRegex)).allow(null)
const acceptStars = Joi.boolean()
const questionnaireId = Joi.string().regex(idRegex);

export const createQuestionChainSchema = Joi.object({
   question: question.required(),
   positiveOptions: positiveOptions.required(),
   negativeOptions: negativeOptions.required(),
   acceptStars: acceptStars.required(),
   conditions: conditions.required(),
   questionnaireId: questionnaireId.required()
});

export const updateQuestionChainSchema = Joi.object({
    question,
    positiveOptions,
    negativeOptions,
    acceptStars,
    conditions,
 });

 export const getQuestionChainSchema = Joi.object({
    id: id.required()
 })

 export const getAllQuestionChainSchema = Joi.object({
   questionnaireId: questionnaireId.required()
 })
