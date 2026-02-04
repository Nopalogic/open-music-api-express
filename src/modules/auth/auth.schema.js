import Joi from "joi";

export const AuthSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
