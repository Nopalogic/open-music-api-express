import express from "express";

import { SongController } from "../controllers/song.controller.js";

export const songRouter = express.Router();

const songController = new SongController();

songRouter.post("/songs", songController.create);
songRouter.get("/songs", songController.findAll);
songRouter.get("/songs/:id", songController.findById);
songRouter.put("/songs/:id", songController.update);
songRouter.delete("/songs/:id", songController.delete);
