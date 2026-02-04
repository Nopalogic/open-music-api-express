import { SongService } from "../services/song.service.js";

export class SongController {
  constructor() {
    this.songService = new SongService();
  }

  async create(req, res, next) {
    try {
      const response = await this.songService.createSong(req.body);

      res.status(201).json({
        status: "success",
        data: { songId: response },
      });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const response = await this.songService.findAllSongs(req.query);

      res.status(200).json({
        status: "success",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const response = await this.songService.findSong(req.params.id);

      res.status(200).json({
        status: "success",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      await this.songService.updateSong(req.params.id, req.body);

      res.status(200).json({
        status: "success",
        message: "Song updated successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await this.songService.deleteSong(req.params.id);

      res.status(200).json({
        status: "success",
        message: "Song deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}
