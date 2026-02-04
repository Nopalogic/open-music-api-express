import express from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";

import { userRouter } from "../modules/user/user.route.js";
import { authRouter } from "../modules/auth/auth.route.js";
import { albumRouter } from "../modules/album/album.route.js";
import { songRouter } from "../modules/song/song.route.js";

import { playlistRouter } from "../modules/playlist/playlist.route.js";
import { activityRouter } from "../modules/activity/activity.route.js";
import { collaborationRouter } from "../modules/collaboration/collaboration.route.js";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRouter);
app.use(authRouter);
app.use(albumRouter);
app.use(songRouter);

app.use(authMiddleware, playlistRouter);
app.use(authMiddleware, activityRouter);
app.use(authMiddleware, collaborationRouter);

app.use(errorMiddleware);
