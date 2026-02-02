import express from "express";

import { AlbumController } from "../controllers/album.controller.js";
import { SongController } from "../controllers/song.controller.js";
import { UserController } from "../controllers/user.controller.js";
import { AuthController } from "../controllers/auth.controller.js";

export const router = express.Router();

router.post("/albums", AlbumController.create);
router.get("/albums/:id", AlbumController.findById);
router.put("/albums/:id", AlbumController.update);
router.delete("/albums/:id", AlbumController.delete);

router.post("/songs", SongController.create);
router.get("/songs", SongController.findAll);
router.get("/songs/:id", SongController.findById);
router.put("/songs/:id", SongController.update);
router.delete("/songs/:id", SongController.delete);

router.post("/users", UserController.register);
router.post("/authentications", UserController.login);

router.put("/authentications", AuthController.verifyToken);
router.delete("/authentications", AuthController.deleteToken);
