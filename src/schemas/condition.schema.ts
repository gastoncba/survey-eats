import Joi from "joi";

import { EntityToCompare, Operator} from "../models/condition.model";

const idRegex = /^[0-9a-fA-F]{24}$/;
const id = Joi.string().regex(idRegex)
const brandId = Joi.string().regex(idRegex);

const value = Joi.string().min(3).max(50);
const entityToCompare = Joi.string().valid(
  EntityToCompare.AGE,
  EntityToCompare.ANSWERED
);
const operator = Joi.string().valid(
    Operator.BETWEEN,
    Operator.IS,
)

export const createConditionSchema = Joi.object({
    value: value.required(),
    entityToCompare: entityToCompare.required(),
    operator: operator.required(),
    brandId: brandId.required()
})

export const updateConditionSchema = Joi.object({
    value,
    entityToCompare,
    operator,
    brandId
})

export const getConditionSchema = Joi.object({
    id: id.required(),
})

export const getAllConditionSchema = Joi.object({
    brandId: brandId.required()
})