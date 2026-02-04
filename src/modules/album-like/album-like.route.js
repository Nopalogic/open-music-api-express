import express from "express";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { AlbumLikeController } from "./album-like.controller.js";

export const albumLikeRouter = express.Router();

const albumLikeController = new AlbumLikeController();

albumLikeRouter.post(
  "/:albumId/likes",
  authMiddleware,
  albumLikeController.addLike,
);
albumLikeRouter.delete(
  "/:albumId/likes",
  authMiddleware,
  albumLikeController.deleteLike,
);
albumLikeRouter.get("/:albumId/likes", albumLikeController.getCountLikes);
