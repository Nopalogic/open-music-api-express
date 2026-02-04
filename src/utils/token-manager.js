import jwt from "jsonwebtoken";
import { Exception } from "../exceptions/index.js";

const TokenManager = {
  generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, { expiresIn: "1h" });
  },
  generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
      expiresIn: "7d",
    });
  },
  verifyAccessToken(token) {
    try {
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
      return payload;
    } catch (error) {
      throw new Exception(401, "Access token tidak valid");
    }
  },
  verifyRefreshToken(token) {
    try {
      const payload = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
      return payload;
    } catch (error) {
      throw new Exception(401, "Refresh token tidak valid");
    }
  },
};

export default TokenManager;
