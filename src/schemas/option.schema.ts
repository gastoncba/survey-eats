import Joi from "joi";

const idRegex = /^[0-9a-fA-F]{24}$/;

const id = Joi.string().regex(idRegex)
const value = Joi.string().min(1).max(50)
const brandId = Joi.string().regex(idRegex)

export const createOptionSchema = Joi.object({
    value: value.required(),
    brandId: brandId.required(),
  });
  
  export const updateOptionSchema = Joi.object({
      value,
      brandId,
  })
  
  export const getOptionSchema = Joi.object({
      id: id.required()
  })

  export const queryOptionSchema = Joi.object({
    brandId
})