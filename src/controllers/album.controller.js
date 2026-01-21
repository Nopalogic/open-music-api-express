import { AlbumService } from "../services/album.service.js";

export class AlbumController {
  static async create(req, res, next) {
    try {
      const response = await AlbumService.create(req.body);

      res.status(201).json({
        status: "success",
        data: { albumId: response },
      });
    } catch (error) {
      next(error);
    }
  }

  static async findById(req, res, next) {
    try {
      const response = await AlbumService.findOne(req.params.id);

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
      await AlbumService.update(req.params.id, req.body);

      res.status(200).json({
        status: "success",
        message: "Album updated successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await AlbumService.delete(req.params.id);

      res.status(200).json({
        status: "success",
        message: "Album deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}
