import { nanoid } from "nanoid";
import { Pool } from "pg";

import { Exception } from "../exceptions/error-handler.js";

import { validate } from "../validations/index.js";
import {
  ActivitySchema,
  PlaylistActivitySchema,
} from "../validations/activity.js";
import { PlaylistService } from "./playlist.service.js";

export class ActivityService {
  static pool = new Pool();

  static async addActivity(request) {
    const { playlistId, songId, userId, action } = validate(
      ActivitySchema,
      request,
    );

    const id = nanoid(16);
    const time = new Date().toISOString();

    const query = {
      text: "INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
      values: [id, playlistId, songId, userId, action, time],
    };

    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(400, "Failed to add activity");
    }
  }

  static async getPlaylistByIdWithActivity(request) {
    const { playlistId, userId } = validate(PlaylistActivitySchema, request);

    await PlaylistService.verifyPlaylistAccess(playlistId, userId);

    const query = {
      text: `
      SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time
      FROM playlist_song_activities
      INNER JOIN songs ON playlist_song_activities.song_id = songs.id
      INNER JOIN users ON playlist_song_activities.user_id = users.id
      WHERE playlist_id = $1
      ORDER BY playlist_song_activities.time ASC`,
      values: [playlistId],
    };

    const { rowCount, rows } = await this.pool.query(query);

    if (!rowCount) {
      throw new Exception(404, "Activity not found.");
    }

    return { playlistId, activities: rows };
  }
}
