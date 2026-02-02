import { nanoid } from "nanoid";
import { Pool } from "pg";
import { Exception } from "../exceptions/error-handler.js";
import { CollaborationSchema } from "../validations/collaboration.js";
import { validate } from "../validations/index.js";

export class CollaborationService {
  static pool = new Pool();

  static async addCollabolator(request) {
    const { playlistId, userId } = validate(CollaborationSchema, request);

    const { rowCount: userExist } = await this.pool.query({
      text: "SELECT id FROM users WHERE id = $1",
      values: [userId],
    });
    const { rowCount: playlistExist } = await this.pool.query({
      text: "SELECT id FROM playlists WHERE id = $1",
      values: [playlistId],
    });

    if (!userExist || !playlistExist) {
      throw new Exception(404, "user not found");
    }

    await this.verifyCollab(userId, playlistId);

    const id = nanoid(16);
    const query = {
      text: "INSERT INTO collaborations (id, playlist_id, user_id) VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, userId],
    };

    const { rowCount, rows } = await this.pool.query(query);

    if (!rowCount) throw new Exception(400, "Failed to add collaboration");

    return { collaborationId: rows[0].id };
  }

  static async verifyCollab(userId, playlistId) {
    const query = {
      text: "SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2",
      values: [playlistId, userId],
    };

    const { rowCount } = await this.pool.query(query);

    if (rowCount) {
      throw new Exception(400, "User is already a collaborator");
    }
  }

  static async deleteCollabolator({ credentials, ...request }) {
    const { playlistId, userId } = validate(CollaborationSchema, request);

    const { rowCount: playlistExist, rows: playlist } = await this.pool.query({
      text: "SELECT owner FROM playlists WHERE id = $1",
      values: [playlistId],
    });

    if (!playlistExist) {
      throw new Exception(404, `Playlist with ID ${playlistId} not found`);
    }

    if (playlist[0].owner !== credentials) {
      throw new Exception(
        403,
        "You don't have permission to access this playlist",
      );
    }

    const query = {
      text: "DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id",
      values: [playlistId, userId],
    };

    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(400, "No collaboration found to delete");
    }
  }
}
