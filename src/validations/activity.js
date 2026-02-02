import Joi from "joi";

export const ActivitySchema = Joi.object({
  playlistId: Joi.string().required(),
  songId: Joi.string().required(),
  userId: Joi.string().required(),
  action: Joi.string().required(),
});

export const PlaylistActivitySchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});
