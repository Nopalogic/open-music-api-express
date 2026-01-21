import { Pool } from "pg";

import { AlbumsSchema } from "../validations/album.js";
import { validate } from "../validations/index.js";

import { Exception } from "../exceptions/error-handler.js";
import { mapDBtoAlbumModel } from "../utils/index.js";
import { nanoid } from "nanoid";

export class AlbumService {
  static pool = new Pool();
  static tableName = "albums";

  static async create(request) {
    const validatedRequest = validate(AlbumsSchema, request);

    const id = nanoid(16);
    const query = {
      text: `INSERT INTO ${this.tableName} (id, name, year) VALUES($1, $2, $3) RETURNING id`,
      values: [id, validatedRequest.name, validatedRequest.year],
    };

    const { rows } = await this.pool.query(query);

    if (!rows[0].id) {
      throw new Exception(400, "Album gagal ditambahkan");
    }

    return rows[0].id;
  }

  static async findOne(id) {
    const query = {
      text: `SELECT * FROM ${this.tableName} WHERE id = $1`,
      values: [id],
    };
    const { rowCount, rows } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(404, "Album not found");
    }

    const albumData = rows[0];
    const songQuery = {
      text: "SELECT * FROM songs WHERE album_id = $1",
      values: [id],
    };

    const { rows: songResult } = await this.pool.query(songQuery);
    const songs = songResult.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer,
    }));

    const resultAlbum = {
      id: albumData.id,
      name: albumData.name,
      year: albumData.year,
      songs,
    };

    return mapDBtoAlbumModel(resultAlbum);
  }

  static async update(id, request) {
    const validatedRequest = validate(AlbumsSchema, request);

    const updatedAt = new Date().toISOString();
    const query = {
      text: `UPDATE ${this.tableName} SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id`,
      values: [validatedRequest.name, validatedRequest.year, updatedAt, id],
    };

    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(404, "Gagal memperbarui album. Id tidak ditemukan");
    }
  }

  static async delete(id) {
    const query = {
      text: `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING id`,
      values: [id],
    };

    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(404, "Gagal menghapus album. Id tidak ditemukan");
    }
  }
}
