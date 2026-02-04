import express from "express";

import { CollaborationController } from "./collaboration.controller.js";

export const collaborationRouter = express.Router();

const collaborationController = new CollaborationController();

collaborationRouter.post(
  "/collaborations",
  collaborationController.addCollabolator,
);
collaborationRouter.delete(
  "/collaborations",
  collaborationController.deleteCollabolator,
);
