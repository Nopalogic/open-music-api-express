import express from "express";

import { AuthController } from "./auth.controller.js";

export const authRouter = express.Router();

const authController = new AuthController();

authRouter.put("/authentications", authController.verifyToken);
authRouter.delete("/authentications", authController.deleteToken);
