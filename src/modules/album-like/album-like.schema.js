import Joi from "joi";

export const AlbumLikeSchema = Joi.object({
  albumId: Joi.string().required(),
  userId: Joi.string().required(),
});
