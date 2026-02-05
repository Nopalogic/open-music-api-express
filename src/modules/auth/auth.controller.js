import { AuthService } from "./auth.service.js";

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  addToken = async (req, res, next) => {
    try {
      await this.authService.addToken(req.body);

      res.status(201).json({
        status: "success",
        message: "Token added successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  verifyToken = async (req, res, next) => {
    try {
      const response = await this.authService.verifyToken(req.body);

      res.status(200).json({
        status: "success",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteToken = async (req, res, next) => {
    try {
      await this.authService.deleteToken(req.body);

      res.status(200).json({
        status: "success",
        message: "Token deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
