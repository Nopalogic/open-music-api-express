import { UserService } from "./user.service.js";

export class UserController {
  constructor() {
    this.userService = new UserService();
  }

  register = async (req, res, next) => {
    try {
      const response = await this.userService.register(req.body);

      res.status(201).json({
        status: "success",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const response = await this.userService.login(req.body);

      res.status(201).json({
        status: "success",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  };
}
