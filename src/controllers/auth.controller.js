import { AuthService } from "../services/auth.service.js";

export class AuthController {
  static async verifyToken(req, res, next) {
    try {
      const response = await AuthService.verifyToken(req.body);

      res.status(200).json({
        status: "success",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteToken(req, res, next) {
    try {
      await AuthService.deleteToken(req.body);

      res.status(200).json({
        status: "success",
        message: "Token deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
