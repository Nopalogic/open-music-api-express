import { verifyToken } from "../utils/token-manager.js";

export const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(" ").pop();

  if (!token) {
    res.status(401).json({
      status: "fail",
      message: "Unauthenticated",
    });
  }

  const { id, username, fullname } = await verifyToken(token);
  const user = { id, username, fullname };

  if (!user) {
    res.status(403).json({
      status: "fail",
      messege: "Unauthorized",
    });
  }

  req.user = user;
  next();
};
