import { ActivityService } from "../services/activity.service.js";

export class ActivityController {
  static async addActivity(req, res, next) {
    req.body.playlistId = req.params.id;
    req.body.userId = req.user.id;

    try {
      const response = await ActivityService.addActivity(req.body);

      res.status(201).json({
        status: "success",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPlaylistByIdWithActivity(req, res, next) {
    const { id: playlistId } = req.params;
    const { id: userId } = req.user;
    try {
      const response = await ActivityService.getPlaylistByIdWithActivity({
        playlistId,
        userId,
      });

      res.status(200).json({
        status: "success",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}
