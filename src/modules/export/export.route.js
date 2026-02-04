import express from "express";

import { ExportController } from "./export.controller.js";

export const exportRouter = express.Router();

const exportController = new ExportController();

exportRouter.post("/playlists/:playlistId", exportController.exportSongs);
