import { Exception } from "../exceptions/error-handler.js";

export const errorMiddleware = (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof Exception) {
    res.status(err.status).json({
      status: "fail",
      message: err.message,
    });
  }

  res.status(500).json({
    errors: err.message,
  });
};
