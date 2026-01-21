import { Pool } from "pg";
import { Exception } from "../exceptions/error-handler.js";
import { mapDBtoSongsModel } from "../utils/index.js";
import { nanoid } from "nanoid";
import { validate } from "../validations/index.js";
import { SongsSchema } from "../validations/song.js";

export class SongService {
  static pool = new Pool();
  static tableName = "songs";

  static async create(request) {
    const validatedRequest = validate(SongsSchema, request);

    const id = nanoid(16);
    const query = {
      text: `INSERT INTO ${this.tableName} (id, title, year, performer, genre, duration, album_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
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

    const { rows } = await this.pool.query(query);

    if (!rows[0].id) {
      throw new Exception(400, "lagu gagal ditambahkan");
    }

    return rows[0].id;
  }

  static async findAll({ title, performer }) {
    let query = "";
    if (title && performer) {
      query = {
        text: `SELECT id, title, performer FROM ${this.tableName} WHERE LOWER(title) LIKE $1 AND LOWER(performer) LIKE $2`,
        values: [`%${title}%`, `%${performer}%`],
      };
    } else if (title) {
      query = {
        text: `SELECT id, title, performer FROM ${this.tableName} WHERE LOWER(title) LIKE $1`,
        values: [`%${title}%`],
      };
    } else if (performer) {
      query = {
        text: `SELECT id, title, performer FROM ${this.tableName} WHERE LOWER(performer) LIKE $1`,
        values: [`%${performer}%`],
      };
    } else {
      query = `SELECT id, title, performer FROM ${this.tableName}`;
    }

    const { rows } = await this.pool.query(query);

    return { songs: rows };
  }

  static async findOne(id) {
    const query = {
      text: `SELECT * FROM ${this.tableName} WHERE id = $1`,
      values: [id],
    };

    const { rows, rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(404, "Lagu tidak ditemukan");
    }

    return { song: mapDBtoSongsModel(rows[0]) };
  }

  static async update(id, request) {
    const validatedRequest = validate(SongsSchema, request);

    const updatedAt = new Date().toISOString();
    const query = {
      text: `UPDATE ${this.tableName} SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id`,
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

  static async delete(id) {
    const query = {
      text: `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING id`,
      values: [id],
    };

    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(404, "Gagal menghapus lagu. Id tidak ditemukan");
    }
  }
}
