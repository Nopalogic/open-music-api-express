import { AuthService } from "../services/auth.service.js";

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async verifyToken(req, res, next) {
    try {
      const response = await this.authService.verifyToken(req.body);

      res.status(200).json({
        status: "success",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteToken(req, res, next) {
    try {
      await this.authService.deleteToken(req.body);

      res.status(200).json({
        status: "success",
        message: "Token deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
