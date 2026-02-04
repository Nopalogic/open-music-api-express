import Joi from "joi";

export class PlaylistSchema {
  static create = Joi.object({
    name: Joi.string().required(),
    owner: Joi.string().optional(),
  });

  static get = Joi.object({
    playlistId: Joi.string().required(),
    userId: Joi.string().optional(),
  });

  static addSong = Joi.object({
    playlistId: Joi.string().required(),
    songId: Joi.string().required(),
    userId: Joi.string().optional(),
  });

  static removeSong = Joi.object({
    playlistId: Joi.string().required(),
    songId: Joi.string().required(),
    userId: Joi.string().required(),
  });
}
