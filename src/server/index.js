import express from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";

import { router as authenticatedRoutes } from "../routes/authenticated.js";
import { router } from "../routes/index.js";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
app.use(authMiddleware, authenticatedRoutes);

app.use(errorMiddleware);
