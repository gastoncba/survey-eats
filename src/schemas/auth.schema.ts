import Joi from "joi";

const email = Joi.string().email();
const token = Joi.string();
const password = Joi.string();
const url = Joi.string().uri();

export const recoverySchema = Joi.object({
  email: email.required(),
  url: url.required(),
});

export const changePasswordSchema = Joi.object({
  token: token.required(),
  newPassword: password.required(),
});

export const loginSchema = Joi.object({
  email: email.required(),
  password: password.required(),
});
