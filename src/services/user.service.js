import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { Pool } from "pg";

import { validate } from "../validations/index.js";
import { LoginSchema, RegisterSchema } from "../validations/user.js";

import { Exception } from "../exceptions/error-handler.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token-manager.js";

import { AuthService } from "./auth.service.js";

export class UserService {
  static pool = new Pool();

  static async register(request) {
    const validatedRequest = validate(RegisterSchema, request);

    const { rowCount: userExist } = await this.pool.query({
      text: "SELECT username from users WHERE username = $1",
      values: [validatedRequest.username],
    });

    if (userExist) {
      throw new Exception(400, "Username is already taken.");
    }

    const id = nanoid(16);
    const hashedPassword = await bcrypt.hash(validatedRequest.password, 10);

    const query = {
      text: "INSERT INTO users (id, username, password, fullname) VALUES($1, $2, $3, $4) RETURNING id",
      values: [
        id,
        validatedRequest.username,
        hashedPassword,
        validatedRequest.fullname,
      ],
    };

    const { rowCount, rows } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(400, "Failed to add user");
    }

    return { userId: rows[0].id };
  }

  static async login(request) {
    const validatedRequest = validate(LoginSchema, request);

    const query = {
      text: "SELECT id, username, password, fullname FROM users WHERE username = $1",
      values: [validatedRequest.username],
    };

    const { rowCount, rows } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(401, "Invalid username or password");
    }

    const { password: hashedPassword, ...user } = rows[0];
    const matchedPassword = await bcrypt.compare(
      validatedRequest.password,
      hashedPassword,
    );

    if (!matchedPassword) {
      throw new Exception(401, "Invalid username or password");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await AuthService.addToken(refreshToken);

    return { user, accessToken, refreshToken };
  }
}
