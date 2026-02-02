import jwt from "jsonwebtoken";
import { Pool } from "pg";

import { Exception } from "../exceptions/error-handler.js";

import { generateAccessToken } from "../utils/token-manager.js";

import { AuthSchema } from "../validations/auth.js";
import { validate } from "../validations/index.js";

export class AuthService {
  static pool = new Pool();

  static async addToken(refreshToken) {
    const validatedToken = validate(AuthSchema, { refreshToken });

    const query = {
      text: "INSERT INTO authentications VALUES($1)",
      values: [validatedToken.refreshToken],
    };

    await this.pool.query(query);
  }

  static async verifyToken(request) {
    const { refreshToken } = validate(AuthSchema, request);

    const query = {
      text: "SELECT token FROM authentications WHERE token = $1",
      values: [refreshToken],
    };

    const { rowCount } = await this.pool.query(query);

    if (!rowCount) throw new Exception(400, "Invalid refresh token");

    const { id, username, fullname } = await this.JwtVerifyToken(refreshToken);

    return { accessToken: generateAccessToken({ id, username, fullname }) };
  }

  static async deleteToken(request) {
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

  static JwtVerifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.REFRESH_TOKEN_KEY, (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded);
      });
    });
  }
}
