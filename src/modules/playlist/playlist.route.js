import express from "express";

import { PlaylistController } from "./playlist.controller.js";

export const playlistRouter = express.Router();

const playlistController = new PlaylistController();

playlistRouter.post("/playlists", playlistController.create);
playlistRouter.get("/playlists", playlistController.getAll);
playlistRouter.post("/playlists/:id/songs", playlistController.addSong);
playlistRouter.get("/playlists/:id/songs", playlistController.getSongs);
playlistRouter.delete("/playlists/:id/songs", playlistController.removeSongs);
playlistRouter.delete("/playlists/:id", playlistController.delete);
