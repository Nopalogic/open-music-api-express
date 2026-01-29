import { PlaylistService } from "../services/playlist.service.js";
import { ActivityService } from "../services/activity.service.js";

export class PlaylistController {
  static async create(req, res, next) {
    req.body.owner = req.user.id;

    try {
      const response = await PlaylistService.createPlaylist(req.body);
      res.status(201).json({
        status: "success",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const response = await PlaylistService.getPlaylists(req.user.id);

      res.status(200).json({
        status: "success",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addSong(req, res, next) {
    req.body.playlistId = req.params.id;
    req.body.userId = req.user.id;

    try {
      await PlaylistService.addSongToPlaylist(req.body);
      await ActivityService.addActivity({ ...req.body, action: "add" });

      res.status(201).json({
        status: "success",
        message: "Song added to playlist.",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSongs(req, res, next) {
    try {
      const response = await PlaylistService.getSongByIdPlaylist(
        req.params.id,
        req.user.id,
      );

      res.status(200).json({
        status: "success",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeSongs(req, res, next) {
    req.body.playlistId = req.params.id;
    req.body.userId = req.user.id;

    try {
      await PlaylistService.deleteSongByIdPlaylist(req.body);
      await ActivityService.addActivity({ ...req.body, action: "delete" });

      res.status(200).json({
        status: "success",
        message: "Song removed from playlist",
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    const { id: playlistId } = req.params;
    const { id: userId } = req.user;

    try {
      await PlaylistService.deletePlaylist({
        playlistId,
        userId,
      });

      res.status(200).json({
        status: "success",
        message: "Playlist deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
