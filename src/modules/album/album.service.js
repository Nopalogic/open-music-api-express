import { nanoid } from "nanoid";
import { Pool } from "pg";

import { Exception } from "../../exceptions/error-handler.js";

import { mapDBtoAlbumModel } from "../../utils/index.js";
import { validate } from "../../utils/validation.js";

import { AlbumSchema } from "./album.schema.js";

export class AlbumService {
  constructor() {
    this.pool = new Pool();
  }

  async createAlbum(request) {
    const { name, year } = validate(AlbumSchema, request);

    const id = nanoid(16);
    const query = {
      text: "INSERT INTO albums (id, name, year) VALUES($1, $2, $3) RETURNING id",
      values: [id, name, year],
    };

    const { rows, rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(400, "Album gagal ditambahkan");
    }

    return rows[0].id;
  }

  async findAlbum(id) {
    const query = {
      text: "SELECT * FROM albums WHERE id = $1",
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

  async updateAlbum({ id, ...request }) {
    const { name, year } = validate(AlbumSchema, request);

    const updatedAt = new Date().toISOString();
    const query = {
      text: "UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id",
      values: [name, year, updatedAt, id],
    };

    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(404, "Gagal memperbarui album. Id tidak ditemukan");
    }
  }

  async deleteAlbum(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };

    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(404, "Gagal menghapus album. Id tidak ditemukan");
    }
  }

  async updateCoverAlbum({ id, coverUrl }) {
    const query = {
      text: "UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id, cover",
      values: [coverUrl, id],
    };
    const { rowCount, rows } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(400, "Album not found");
    }

    return rows[0];
  }
}
