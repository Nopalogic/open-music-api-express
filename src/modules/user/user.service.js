import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { Pool } from "pg";

import { Exception } from "../../exceptions/error-handler.js";

import TokenManager from "../../utils/token-manager.js";
import { validate } from "../../utils/validation.js";

import { AuthService } from "../auth/auth.service.js";
import { LoginSchema, RegisterSchema } from "./user.schema.js";

export class UserService {
  constructor() {
    this.pool = new Pool();
    this.authService = new AuthService();
  }

  async register(request) {
    const { username, password, fullname } = validate(RegisterSchema, request);

    const { rowCount: userExist } = await this.pool.query({
      text: "SELECT username from users WHERE username = $1",
      values: [username],
    });

    if (userExist) {
      throw new Exception(400, "Username is already taken.");
    }

    const id = nanoid(16);
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: "INSERT INTO users (id, username, password, fullname) VALUES($1, $2, $3, $4) RETURNING id",
      values: [id, username, hashedPassword, fullname],
    };

    const { rowCount, rows } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(400, "Failed to add user");
    }

    return { userId: rows[0].id };
  }

  async login(request) {
    const { username, password } = validate(LoginSchema, request);

    const query = {
      text: "SELECT id, username, password, fullname FROM users WHERE username = $1",
      values: [username],
    };

    const { rowCount, rows } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(401, "Invalid username or password");
    }

    const { password: hashedPassword, ...user } = rows[0];
    const matchedPassword = await bcrypt.compare(password, hashedPassword);

    if (!matchedPassword) {
      throw new Exception(401, "Invalid username or password");
    }

    const accessToken = TokenManager.generateAccessToken(user);
    const refreshToken = TokenManager.generateRefreshToken(user);

    await this.authService.addToken({ refreshToken });

    return { user, accessToken, refreshToken };
  }
}
