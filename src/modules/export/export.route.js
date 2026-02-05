import express from "express";

import { ExportController } from "./export.controller.js";

export const exportRouter = express.Router();

const exportController = new ExportController();

exportRouter.post("/export/playlists/:id", exportController.exportSongs);
