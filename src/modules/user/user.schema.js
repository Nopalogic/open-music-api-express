import Joi from "joi";

export const RegisterSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});

export const LoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const GetUserSchema = Joi.object({
  userId: Joi.string().required(),
});
