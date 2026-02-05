import { Exception } from "../../exceptions/error-handler.js";
import { AlbumService } from "./album.service.js";

export class AlbumController {
  constructor() {
    this.albumService = new AlbumService();
  }

  create = async (req, res, next) => {
    try {
      const response = await this.albumService.createAlbum(req.body);

      res.status(201).json({
        status: "success",
        data: { albumId: response },
      });
    } catch (error) {
      next(error);
    }
  };

  findById = async (req, res, next) => {
    try {
      const response = await this.albumService.findAlbum(req.params.id);

      res.status(200).json({
        status: "success",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      await this.albumService.updateAlbum(req.params.id, req.body);

      res.status(200).json({
        status: "success",
        message: "Album updated successfully.",
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.albumService.deleteAlbum(req.params.id);

      res.status(200).json({
        status: "success",
        message: "Album deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  };

  uploadCover = async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!req.file) {
        throw new Exception(400, "No file uploaded");
      }

      const host = process.env.HOST || "localhost";
      const port = process.env.PORT || "3000";

      const encodedFilename = encodeURIComponent(req.file.filename);
      const coverUrl = `http://${host}:${port}/uploads/${encodedFilename}`;

      await this.albumService.updateCoverAlbum({
        id,
        coverUrl,
      });

      res.status(201).json({
        status: "success",
        message: "Cover uploaded successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
