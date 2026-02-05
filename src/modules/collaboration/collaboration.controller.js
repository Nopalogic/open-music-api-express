import { CollaborationService } from "./collaboration.service.js";
import { PlaylistService } from "../playlist/playlist.service.js";

export class CollaborationController {
  constructor() {
    this.collaborationService = new CollaborationService();
    this.playlistService = new PlaylistService();
  }

  addCollabolator = async (req, res, next) => {
    const { playlistId, userId } = req.body;
    const { id: credentials } = req.user;

    try {
      await this.playlistService.verifyPlaylistAccess(playlistId, credentials);

      const response = await this.collaborationService.addCollabolator({
        playlistId,
        userId,
      });

      res.status(201).json({
        status: "success",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCollabolator = async (req, res, next) => {
    const { playlistId, userId } = req.body;
    const { id: credentials } = req.user;

    try {
      await this.collaborationService.deleteCollabolator({
        playlistId,
        userId,
        credentials,
      });

      res.status(200).json({
        status: "success",
        message: "Collaboration has been successfully removed",
      });
    } catch (error) {
      next(error);
    }
  };
}
