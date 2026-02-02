import express from "express";

import { PlaylistController } from "../controllers/playlist.controller.js";
import { ActivityController } from "../controllers/activity.controller.js";
import { CollaborationController } from "../controllers/collaboration.controller.js";

export const router = express.Router();

router.post("/playlists", PlaylistController.create);
router.get("/playlists", PlaylistController.getAll);
router.post("/playlists/:id/songs", PlaylistController.addSong);
router.get("/playlists/:id/songs", PlaylistController.getSongs);
router.delete("/playlists/:id/songs", PlaylistController.removeSongs);
router.delete("/playlists/:id", PlaylistController.delete);

router.post("/playlists/:id/activities", ActivityController.addActivity);
router.get(
  "/playlists/:id/activities",
  ActivityController.getPlaylistByIdWithActivity,
);

router.post("/collaborations", CollaborationController.addCollabolator);
router.delete("/collaborations", CollaborationController.deleteCollabolator);
