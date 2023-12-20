import Joi from "joi";

const firstName = Joi.string();
const lastName = Joi.string();
const email = Joi.string().email();
const password = Joi.string();

export const createUserSchema = Joi.object({
  firstName: firstName.required(),
  lastName: lastName.required(),
  email: email.required(),
  password: password.required(),
});

export const updateUserSchema = Joi.object({
  firstName,
  lastName,
  email,
  password,
});
