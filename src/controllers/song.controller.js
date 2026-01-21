import { SongService } from "../services/song.service.js";

export class SongController {
  static async create(req, res, next) {
    try {
      const response = await SongService.create(req.body);

      res.status(201).json({
        status: "success",
        data: { songId: response },
      });
    } catch (error) {
      next(error);
    }
  }

  static async findAll(req, res, next) {
    try {
      const response = await SongService.findAll(req.query);

      res.status(200).json({
        status: "success",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async findById(req, res, next) {
    try {
      const response = await SongService.findOne(req.params.id);

      res.status(200).json({
        status: "success",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      await SongService.update(req.params.id, req.body);

      res.status(200).json({
        status: "success",
        message: "Song updated successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await SongService.delete(req.params.id);

      res.status(200).json({
        status: "success",
        message: "Song deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}
