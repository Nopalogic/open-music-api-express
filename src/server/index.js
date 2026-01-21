import express from "express";

import { errorMiddleware } from "../middlewares/error.middleware.js";
import { router } from "../routes/index.js";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use(errorMiddleware);
