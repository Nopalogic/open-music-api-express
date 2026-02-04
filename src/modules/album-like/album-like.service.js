import { nanoid } from "nanoid";
import { Pool } from "pg";

import { Exception } from "../../exceptions/error-handler.js";

import { RedisService } from "../../lib/redis.service.js";

import { validate } from "../../utils/validation.js";

import { AlbumLikeSchema } from "./album-like.schema.js";

export class AlbumLikeService {
  constructor() {
    this.pool = new Pool();
    this.redisService = new RedisService();
  }

  async addLike(request) {
    const { userId, albumId } = validate(AlbumLikeSchema, request);

    const id = nanoid(16);
    const query = {
      text: "INSERT INTO user_album_likes (id, user_id, album_id) VALUES ($1, $2, $3) RETURNING id",
      values: [id, userId, albumId],
    };

    const { rows } = await this.pool.query(query);
    await this.redisService._client.del(`album_likes:${albumId}`);

    return rows[0].id;
  }

  async removeLike(request) {
    const { userId, albumId } = validate(AlbumLikeSchema, request);

    const query = {
      text: "DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id",
      values: [userId, albumId],
    };

    const { rowCount, rows } = await this.pool.query(query);

    if (!rowCount) {
      return null;
    }
    await this.redisService._client.del(`album_likes:${albumId}`);

    return rows[0].id;
  }

  async getCountLikes(albumId) {
    const cacheKey = `album_likes:${albumId}`;

    try {
      const cached = await this.redisService._client.get(cacheKey);

      if (cached) {
        return { count: JSON.parse(cached), source: "cache" };
      }

      throw new Error("Cache Error");
    } catch {
      const query = {
        text: "SELECT COUNT(*) AS like_count FROM user_album_likes WHERE album_id = $1",
        values: [albumId],
      };

      const result = await this.pool.query(query);
      const count = parseInt(result.rows[0].like_count, 10);

      await this.redisService._client.set(cacheKey, JSON.stringify(count));

      return {
        count,
        source: "database",
      };
    }
  }

  async isAlbumLikedByUser(request) {
    const { userId, albumId } = validate(AlbumLikeSchema, request);

    const query = {
      text: "SELECT 1 FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
      values: [userId, albumId],
    };

    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(
        400,
        "Gagal menambahkan like. Album sudah pernah di-like oleh user ini",
      );
    }
  }
}
