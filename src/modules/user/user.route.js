import express from "express";

import { UserController } from "./user.controller.js";

export const userRouter = express.Router();

const userController = new UserController();

userRouter.post("/users", userController.register);
userRouter.post("/authentications", userController.login);
