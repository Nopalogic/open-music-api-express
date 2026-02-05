import express from "express";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { AlbumLikeController } from "./album-like.controller.js";

export const albumLikeRouter = express.Router();

const albumLikeController = new AlbumLikeController();

albumLikeRouter.post(
  "/albums/:id/likes",
  authMiddleware,
  albumLikeController.addLike,
);
albumLikeRouter.delete(
  "/albums/:id/likes",
  authMiddleware,
  albumLikeController.deleteLike,
);
albumLikeRouter.get("/albums/:id/likes", albumLikeController.getCountLikes);
