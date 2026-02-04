import { Pool } from "pg";

import { Exception } from "../../exceptions/error-handler.js";

import TokenManager from "../../utils/token-manager.js";
import { validate } from "../../utils/validation.js";

import { AuthSchema } from "../../validations/auth.js";

export class AuthService {
  constructor() {
    this.pool = new Pool();
  }

  async addToken(request) {
    const { refreshToken } = validate(AuthSchema, request);

    const query = {
      text: "INSERT INTO authentications VALUES($1)",
      values: [refreshToken],
    };

    await this.pool.query(query);
  }

  async verifyToken(request) {
    const { refreshToken } = validate(AuthSchema, request);

    const query = {
      text: "SELECT token FROM authentications WHERE token = $1",
      values: [refreshToken],
    };

    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(400, "Invalid refresh token");
    }

    const { id, username, fullname } =
      await TokenManager.verifyRefreshToken(refreshToken);

    return {
      accessToken: TokenManager.generateAccessToken({ id, username, fullname }),
    };
  }

  async deleteToken(request) {
    const { refreshToken } = validate(AuthSchema, request);

    const query = {
      text: "DELETE FROM authentications WHERE token = $1",
      values: [refreshToken],
    };

    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(400, "Invalid token");
    }
  }
}
