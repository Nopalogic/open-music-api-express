import express from "express";

import { ActivityController } from "./activity.controller.js";

export const activityRouter = express.Router();

const activityController = new ActivityController();

activityRouter.post(
  "/playlists/:id/activities",
  activityController.addActivity,
);
activityRouter.get(
  "/playlists/:id/activities",
  activityController.getPlaylistByIdWithActivity,
);
