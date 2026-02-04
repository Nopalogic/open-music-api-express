import { ActivityService } from "../activity/activity.service.js";
import { PlaylistService } from "./playlist.service.js";

export class PlaylistController {
  constructor() {
    this.playlistService = new PlaylistService();
  }
  async create(req, res, next) {
    const { id: owner } = req.user;

    try {
      const response = await this.playlistService.createPlaylist({
        ...req.body,
        owner,
      });

      res.status(201).json({
        status: "success",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    const { id: playlistId } = req.params;

    try {
      const response = await this.playlistService.getPlaylists({ playlistId });

      res.status(200).json({
        status: "success",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  async addSong(req, res, next) {
    const { id: playlistId } = req.params;
    const { id: userId } = req.user;

    try {
      await this.playlistService.addSongToPlaylist(req.body);
      await ActivityService.addActivity({
        playlistId,
        userId,
        ...req.body,
        action: "add",
      });

      res.status(201).json({
        status: "success",
        message: "Song added to playlist.",
      });
    } catch (error) {
      next(error);
    }
  }

  async getSongs(req, res, next) {
    try {
      const response = await this.playlistService.getSongByIdPlaylist(
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

  async removeSongs(req, res, next) {
    const { id: playlistId } = req.params;
    const { id: userId } = req.user;

    try {
      await this.playlistService.deleteSongByIdPlaylist(req.body);
      await ActivityService.addActivity({
        playlistId,
        userId,
        ...req.body,
        action: "delete",
      });

      res.status(200).json({
        status: "success",
        message: "Song removed from playlist",
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    const { id: playlistId } = req.params;
    const { id: userId } = req.user;

    try {
      await this.playlistService.deletePlaylist({
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
