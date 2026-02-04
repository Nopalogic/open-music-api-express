import { CollaborationService } from "../services/collaboration.service.js";
import { PlaylistService } from "../services/playlist.service.js";

export class CollaborationController {
  static async addCollabolator(req, res, next) {
    const { playlistId, userId } = req.body;
    const { id: credentials } = req.user;

    try {
      await PlaylistService.verifyPlaylistAccess(playlistId, credentials);

      const response = await CollaborationService.addCollabolator({
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
  }

  static async deleteCollabolator(req, res, next) {
    const { playlistId, userId } = req.body;
    const { id: credentials } = req.user;

    try {
      await CollaborationService.deleteCollabolator({
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
  }
}
