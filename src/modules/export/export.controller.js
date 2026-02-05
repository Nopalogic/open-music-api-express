import { validate } from "../../utils/validation.js";

import { PlaylistService } from "../playlist/playlist.service.js";

import { ExportPayloadSchema } from "./export.schema.js";
import { ExportService } from "./export.service.js";

export class ExportController {
  constructor() {
    this.exportService = new ExportService();
    this.playlistService = new PlaylistService();
  }

  exportSongs = async (req, res, next) => {
    const { id: playlistId } = req.params;
    const { id: userId } = req.user;
    const { targetEmail } = validate(ExportPayloadSchema, req.body);

    try {
      await this.playlistService.getPlaylistById({ playlistId, userId });

      const message = {
        playlistId,
        targetEmail,
      };

      await this.exportService.sendMessage(
        "export:songs",
        JSON.stringify(message),
      );

      res.status(201).json({
        status: "success",
        message: "Permintaan Anda dalam antrean untuk diproses",
      });
    } catch (error) {
      next(error);
    }
  };
}
