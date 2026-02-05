import fs from "fs";
import path from "path";
import multer from "multer";

import { Exception } from "../exceptions/error-handler.js";

export const UPLOAD_FOLDER = path.resolve(
  process.cwd(),
  "src/modules/album/files/images",
);

if (!fs.existsSync(UPLOAD_FOLDER)) {
  fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_FOLDER),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 512000 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Exception(400, "Allowed image file only"), false);
  },
});

export const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      throw new Exception(413, "File size more than 500KB");
    }

    throw new Exception(400, err.message);
  }
  if (err instanceof Exception) {
    return next(err);
  }

  next(err);
};

export default { UPLOAD_FOLDER, storage, upload };
