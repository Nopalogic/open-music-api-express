import { nanoid } from "nanoid";
import { Pool } from "pg";

import { Exception } from "../../exceptions/error-handler.js";

import { mapDBtoSongsModel } from "../../utils/index.js";
import { validate } from "../../utils/validation.js";

import { SongSchema } from "./song.schema.js";

export class SongService {
  constructor() {
    this.pool = new Pool();
  }

  async createSong(request) {
    const validatedRequest = validate(SongSchema, request);

    const id = nanoid(16);
    const query = {
      text: "INSERT INTO songs (id, title, year, performer, genre, duration, album_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [
        id,
        validatedRequest.title,
        validatedRequest.year,
        validatedRequest.performer,
        validatedRequest.genre,
        validatedRequest.duration,
        validatedRequest.albumId,
      ],
    };

    const { rowCount, rows } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(400, "lagu gagal ditambahkan");
    }

    return rows[0].id;
  }

  async findAllSongs({ title, performer }) {
    let query = "";
    if (title && performer) {
      query = {
        text: "SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE $1 AND LOWER(performer) LIKE $2",
        values: [`%${title}%`, `%${performer}%`],
      };
    } else if (title) {
      query = {
        text: "SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE $1",
        values: [`%${title}%`],
      };
    } else if (performer) {
      query = {
        text: "SELECT id, title, performer FROM songs WHERE LOWER(performer) LIKE $1",
        values: [`%${performer}%`],
      };
    } else {
      query = "SELECT id, title, performer FROM songs";
    }

    const { rows } = await this.pool.query(query);

    return { songs: rows };
  }

  async findSong(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };

    const { rows, rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(404, "Lagu tidak ditemukan");
    }

    return { song: mapDBtoSongsModel(rows[0]) };
  }

  async updateSong(id, request) {
    const validatedRequest = validate(SongSchema, request);

    const updatedAt = new Date().toISOString();
    const query = {
      text: "UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id",
      values: [
        validatedRequest.title,
        validatedRequest.year,
        validatedRequest.performer,
        validatedRequest.genre,
        validatedRequest.duration,
        validatedRequest.albumId,
        updatedAt,
        id,
      ],
    };

    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(404, "Gagal memperbarui lagu. Id tidak ditemukan");
    }
  }

  async deleteSong(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };

    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(404, "Gagal menghapus lagu. Id tidak ditemukan");
    }
  }
}
