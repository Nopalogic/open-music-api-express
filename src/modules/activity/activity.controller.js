import { ActivityService } from "./activity.service.js";

export class ActivityController {
  constructor() {
    this.activityService = new ActivityService();
  }

  addActivity = async (req, res, next) => {
    req.body.playlistId = req.params.id;
    req.body.userId = req.user.id;

    try {
      const response = await this.activityService.addActivity(req.body);

      res.status(201).json({
        status: "success",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  };

  getPlaylistByIdWithActivity = async (req, res, next) => {
    const { id: playlistId } = req.params;
    const { id: userId } = req.user;
    try {
      const response = await this.activityService.getPlaylistByIdWithActivity({
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
  };
}
