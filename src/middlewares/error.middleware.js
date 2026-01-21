import { Exception } from "../exceptions/error-handler.js";

export const errorMiddleware = async (err, req, res, next) => {
  if (err instanceof Exception) {
    res.status(err.status).json({
      status: "fail",
      message: err.message,
    });
  }

  console.log(err);
  
  res.status(500).json({
    errors: err.message,
  });
};
