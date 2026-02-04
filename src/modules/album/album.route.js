import express from "express";

import { AlbumController } from "./album.controller.js";
import { upload, uploadErrorHandler } from "../../config/storage.config.js";

export const albumRouter = express.Router();

const albumController = new AlbumController();

albumRouter.post("/albums", albumController.create);
albumRouter.get("/albums/:id", albumController.findById);
albumRouter.put("/albums/:id", albumController.update);
albumRouter.delete("/albums/:id", albumController.delete);
albumRouter.post(
  "/albums/:id/covers",
  upload.single("cover"),
  albumController.uploadCover,
  uploadErrorHandler,
);
