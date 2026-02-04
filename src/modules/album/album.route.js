import express from "express";

import { AlbumController } from "../controllers/album.controller.js";

export const albumRouter = express.Router();

const albumController = new AlbumController();

albumRouter.post("/albums", albumController.create);
albumRouter.get("/albums/:id", albumController.findById);
albumRouter.put("/albums/:id", albumController.update);
albumRouter.delete("/albums/:id", albumController.delete);
