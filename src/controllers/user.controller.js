import { UserService } from "../services/user.service.js";

export class UserController {
  static async register(req, res, next) {
    try {
      const response = await UserService.register(req.body);

      res.status(201).json({
        status: "success",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const response = await UserService.login(req.body);

      res.status(201).json({
        status: "success",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}
